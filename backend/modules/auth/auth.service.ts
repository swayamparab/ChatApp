import { db } from "../../db";
import { users } from "../../db/schema/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import type { SignupInput } from "./auth.validation";

export async function signup(data: SignupInput) {
    const existingUsername = await db.query.users.findFirst({
        where: eq(users.username, data.username)
    })

    if (existingUsername) {
        throw new Error("Username already exists");
    }

    const existingEmail = await db.query.users.findFirst({
        where: eq(users.email, data.email),
    });

    if (existingEmail) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [user] = await db.insert(users)
        .values({
            username:data.username,
            email:data.email,
            password:hashedPassword
        })
        .returning()

    const {password, ...safeUser} = user;

    return safeUser
}