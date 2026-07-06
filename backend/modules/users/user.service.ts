import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function findUserById(userId:string) {
    return db.query.users.findFirst({
        where: eq(users.id, userId)
    })
}