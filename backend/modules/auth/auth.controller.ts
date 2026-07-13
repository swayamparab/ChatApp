import { Request, Response } from "express";
import { login, signup } from "./auth.service";
import { loginSchema, signupSchema } from "./auth.validation";
import { ZodError } from "zod";
import { findUserById } from "../users/user.service";

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

export async function loginController(req: Request, res: Response) {
    try {

        const data = loginSchema.parse(req.body);

        const { token, user } = await login(data);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
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
                case "User does not exist":
                case "Invalid Credentials":
                    return res.status(401).json({
                        success: false,
                        message: "Invalid credentials",
                    });
            }
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export async function logoutController(req: Request, res: Response) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export async function getMeController(req: Request, res: Response) {
    try {
        const user = await findUserById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const { password, ...safeUser } = user;

        return res.status(200).json({
            success: true,
            user: safeUser,
        });
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}