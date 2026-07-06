import { verifyToken } from "@/lib/jwt";
import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const payload = verifyToken(token);

        req.userId = payload.userId;

        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
}