import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { and, ilike, ne, or } from "drizzle-orm";

export async function findUserById(userId: string) {
    return db.query.users.findFirst({
        where: eq(users.id, userId)
    })
}

export async function searchUsers(currentUserId: string, query: string) {
    return await db.query.users.findMany({
        where: and(
            ne(users.id, currentUserId),
            or(
                ilike(users.username, `%${query}%`),
                ilike(users.email, `%${query}%`)
            )
        ),

        columns: {
            id: true,
            username: true,
            email: true,
        },

        limit: 10,
    });
}