import { Request, Response, NextFunction } from "express";
import { loginRateLimit, signupRateLimit } from "../lib/ratelimit";

export async function loginLimiter(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const ip =
        req.ip ??
        req.headers["x-forwarded-for"]?.toString() ??
        "unknown";

    const { success } = await loginRateLimit.limit(ip);

    if (!success) {
        return res.status(429).json({
            success: false,
            message:
                "Too many login attempts. Please try again later.",
        });
    }

    next();
}

export async function signupLimiter(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const ip =
        req.ip ??
        req.headers["x-forwarded-for"]?.toString() ??
        "unknown";

    const { success } = await signupRateLimit.limit(ip);

    if (!success) {
        return res.status(429).json({
            success: false,
            message:
                "Too many signup attempts. Please try again later.",
        });
    }

    next();
}