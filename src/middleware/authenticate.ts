import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import BlacklistedToken from "../models/tokenBlackList.model";

dotenv.config();

const authenticateBlackList = (req: Request, res: Response, next: NextFunction): void => {
    console.log('req.cookies.accessToken ::: ', req.cookies.accessToken);
    console.log('req.headers.authorization ::: ', req.headers.authorization?.split(" "));

    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ success: false, message: "Access Denied. No token provided." });
        return;
    }

    BlacklistedToken.findOne({ token })
        .then((isBlacklisted) => {
            if (isBlacklisted) {
                res.status(401).json({ success: false, message: "Token is blacklisted. Please log in again." });
                return;
            }

            next(); // ✅ Correctly calling `next()`
        })
        .catch(() => {
            res.status(500).json({ success: false, message: "Internal Server Error." });
        });
};

export default authenticateBlackList;
