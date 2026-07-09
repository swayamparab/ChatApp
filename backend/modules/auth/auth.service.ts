import { db } from "../../db";
import { users } from "../../db/schema/users";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import type { SignupInput } from "./auth.validation";
import type { LoginInput } from "./auth.validation";
import { generateToken } from "../../lib/jwt";

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

export async function login(data:LoginInput) {
    
    const user = await db.query.users.findFirst({
        where: or(
            eq(users.username, data.identifier),
            eq(users.email, data.identifier)
        )
    })

    if(!user){
        throw new Error("User does not exist")
    }

    const correctPassword = await bcrypt.compare(data.password, user.password);

    if(!correctPassword){
        throw new Error("Invalid Credentials")
    }

    const token = generateToken(user.id);

    const {password, ...safeUser} = user;

    return{
        token,
        user: safeUser
    }
}