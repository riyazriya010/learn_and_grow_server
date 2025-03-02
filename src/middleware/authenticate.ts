
// import { NextFunction, Request, Response } from 'express';
// import BlacklistedToken from "../models/tokenBlackList.model";

// interface AuthenticatedRequest extends Request {
//     user?: {
//         user: string;
//         role: string;
//         version: string;
//         iat: number;
//         exp: number;
//     };
// }

// const authenticateBlackList = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
//     console.log('blacklist middleware entered ')
//     const accessToken = req.cookies['accessToken'];
//     if (!accessToken) {
//         return res
//             .status(401)
//             .send({ failToken: true, message: 'No access token provided' });
//     }

//     BlacklistedToken.findOne({ token: accessToken })
//         .then((isBlacklisted) => {
//             if (isBlacklisted) {
//                 res.status(401).send({ success: false, message: "Token is blacklisted. Please log in again." });
//                 return;
//             }

//             next();
//         })
//         .catch(() => {
//             res.status(500).send({ success: false, message: "Internal Server Error." });
//         });
//     console.log('blacklist middleware crossed')

// }

// export default authenticateBlackList;




import { NextFunction, Request, Response } from 'express';
import BlacklistedToken from "../models/tokenBlackList.model";
import { JWT_SECRET } from '../utils/constants';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';

interface AuthenticatedRequest extends Request {
    user?: {
        user: string;
        role: string;
        version: string;
        iat: number;
        exp: number;
    };
}

const authenticateBlackList = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    console.log('Blacklist middleware entered');

    const accessToken = req.cookies['accessToken'];
    if (!accessToken) {
        return res.status(401).send({ failToken: true, message: 'No access token provided' });
    }

    try {
        // Check if token is blacklisted
        const isBlacklisted = await BlacklistedToken.findOne({ token: accessToken });
        if (isBlacklisted) {
            return res.status(401).send({ success: false, message: "Token is blacklisted. Please log in again." });
        }

        // Verify token
        const decodedData = jwt.verify(accessToken, JWT_SECRET) as AuthenticatedRequest['user'];
        if (!decodedData || !decodedData.user) {
            return res.status(401).send({ success: false, message: "Invalid token." });
        }

        // Fetch user from DB
        const userFromDB = await UserModel.findById(decodedData.user).select('version');
        if (!userFromDB) {
            return res.status(401).send({ success: false, message: "User not found." });
        }

        // Check if token version matches user version
        if (decodedData.version !== userFromDB.version) {
            return res.status(401).send({ success: false, message: "Token is blacklist. Please log in again." });
        }

        // Attach user data to request
        req.user = decodedData;
        console.log('Blacklist middleware passed');
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).send({ success: false, message: "Invalid or expired token." });
    }
}

export default authenticateBlackList;
