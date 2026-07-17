import { verifyToken } from "../lib/jwt";
import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    console.log("Headers Cookie:", req.headers.cookie);
    console.log("Parsed Cookies:", req.cookies);

    const token = req.cookies.token;

    console.log("Token:", token);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    const payload = verifyToken(token);

    console.log("Payload:", payload);

    req.userId = payload.userId;

    next();
}