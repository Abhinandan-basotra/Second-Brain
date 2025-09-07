import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken";
import 'express';
import { getJwtSecret } from "../utils/getJwtSecret";

declare module 'express-serve-static-core' {
    interface Request {
        userId?: string;
    }
}
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token
        
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }
        const decoded = jwt.verify(token as string, getJwtSecret()) as JwtPayload;

        if (decoded) {
            req.userId = decoded.id
            next();
        } else {
            res.status(401).json({ message: "Unauthorized User" });
        }
    } catch (error) {
        console.log(error);

        res.status(401).json({ message: "Unauthorized User" });
    }
}