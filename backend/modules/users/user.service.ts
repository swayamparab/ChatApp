import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { and, ilike, ne, or } from "drizzle-orm";
import { redis } from "../../lib/redis";
import bcrypt from "bcrypt";
import { UpdateProfileInput } from "./user.validation";

export async function updateProfile(
    userId: string,
    data: UpdateProfileInput
) {
    const currentUser = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!currentUser) {
        throw new Error("User not found");
    }

    const updates: Partial<typeof users.$inferInsert> = {};

    if (Object.keys(updates).length === 0) {
        throw new Error("Nothing to update");
    }

    // Username
    if (
        data.username &&
        data.username !== currentUser.username
    ) {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.username, data.username),
        });

        if (existingUser) {
            throw new Error("Username already exists");
        }

        updates.username = data.username;
    }

    // Password
    if (data.newPassword) {
        const validPassword = await bcrypt.compare(
            data.currentPassword!,
            currentUser.password
        );

        if (!validPassword) {
            throw new Error("Current password is incorrect");
        }

        updates.password = await bcrypt.hash(
            data.newPassword,
            10
        );
    }

    const [updatedUser] = await db
        .update(users)
        .set(updates)
        .where(eq(users.id, userId))
        .returning();

    await redis.set(
        `relay:currentuser:${userId}`,
        updatedUser,
        {
            ex: 300,
        }
    );

    const { password, ...safeUser } = updatedUser;

    return safeUser;
}

type CachedUser = {
    id: string;
    username: string;
    email: string;
    password: string;
    lastSeen: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

export async function findUserById(userId: string) {

    const cacheKey = `relay:currentuser:${userId}`;

    const cached = await redis.get<CachedUser>(cacheKey);

    if (cached) {
        return cached;
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, userId),
    });

    if (!user) {
        return null;
    }

    await redis.set(cacheKey, user, {
        ex: 300,
    });

    return user;
}

type SearchUser = {
    id: string;
    username: string;
    email: string;
};

export async function searchUsers(
    currentUserId: string,
    query: string
) {
    const normalizedQuery = query.trim().toLowerCase();

    const cacheKey = `relay:search-users:${currentUserId}:${normalizedQuery}`;

    const cached = await redis.get<SearchUser[]>(cacheKey);

    if (cached) {
        // console.log("Redis HIT");
        return cached;
    }

    // console.log("Redis MISS");

    const usersResult = await db.query.users.findMany({
        where: and(
            ne(users.id, currentUserId),
            or(
                ilike(users.username, `%${normalizedQuery}%`),
                ilike(users.email, `%${normalizedQuery}%`)
            )
        ),
        columns: {
            id: true,
            username: true,
            email: true,
        },
        limit: 10,
    });

    await redis.set(cacheKey, usersResult, {
        ex: 300,
    });

    return usersResult;
}