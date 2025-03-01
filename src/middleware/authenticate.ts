
import { NextFunction, Request, Response } from 'express';
import BlacklistedToken from "../models/tokenBlackList.model";

interface AuthenticatedRequest extends Request {
    user?: {
        user: string;
        role: string;
        iat: number;
        exp: number;
    };
}

const authenticateBlackList = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    console.log('blacklist middleware entered ')
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];
    if (!accessToken) {
        return res
            .status(401)
            .send({ failToken: true, message: 'No access token provided' });
    }

    BlacklistedToken.findOne({ token: accessToken })
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


}

export default authenticateBlackList;


// import { Request, Response, NextFunction } from "express";
// import dotenv from "dotenv";
// import BlacklistedToken from "../models/tokenBlackList.model";

// dotenv.config();

// const authenticateBlackList = (req: Request, res: Response, next: NextFunction): void => {
//     console.log('req.cookies.accessToken ::: ', req.cookies.accessToken);
//     console.log('req.headers.authorization ::: ', req.headers.authorization?.split(" "));

//     const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

//     if (!token) {
//         res.status(401).json({ success: false, message: "Access Denied. No token provided." });
//         return;
//     }

//     BlacklistedToken.findOne({ token })
//         .then((isBlacklisted) => {
//             if (isBlacklisted) {
//                 res.status(401).json({ success: false, message: "Token is blacklisted. Please log in again." });
//                 return;
//             }

//             next(); // ✅ Correctly calling `next()`
//         })
//         .catch(() => {
//             res.status(500).json({ success: false, message: "Internal Server Error." });
//         });
// };

// export default authenticateBlackList;
