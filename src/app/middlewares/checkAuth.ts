import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { Role } from "../modules/user/user.interface";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth = (...authRoles: Role[]) => (req: Request, res: Response, next: NextFunction)=>{
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError(403, "No Token Received");
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_KEY as string) as JwtPayload
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route!!!")
        }

        next();

    } catch (error) {
        next(error);
    }

}
