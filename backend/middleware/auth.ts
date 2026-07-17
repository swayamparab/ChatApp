import { verifyToken } from "../lib/jwt";
import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.token;

        return res.json({
            cookies: req.cookies,
            token,
            tokenExists: !!token,
            jwtSecretExists: !!process.env.JWT_SECRET,
            verifyResult: (() => {
                try {
                    return verifyToken(token);
                } catch (e) {
                    return {
                        error: e instanceof Error ? e.message : String(e),
                    };
                }
            })(),
        });

    } catch (e) {
        return res.json({
            outerError: e instanceof Error ? e.message : String(e),
        });
    }
}