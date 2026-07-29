import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export async function findUserForCall(userId: string) {
    return db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
            id: true,
            username: true,
        },
    });
}