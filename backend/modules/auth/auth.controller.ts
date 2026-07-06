import { Request, Response } from "express";
import { signup } from "./auth.service";
import { signupSchema } from "./auth.validation";
import { ZodError } from "zod";

export async function signupController(req: Request, res: Response) {
    try {
        const data = signupSchema.parse(req.body)

        const user = await signup(data)

        return res.status(201).json({
            success: true,
            message: "user created successfully",
            user
        })
    }
    catch (error) {
        console.error(error);

        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.issues,
            });
        }

        if (error instanceof Error) {
            switch (error.message) {
                case "Username already exists":
                case "Email already exists":
                    return res.status(409).json({
                        success: false,
                        message: error.message,
                    });
            }
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}