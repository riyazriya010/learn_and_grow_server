





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
    if (!accessToken) {
        return res
            .status(401)
            .send({ failToken: true, message: 'No access token provided' });
    }

    BlacklistedToken.findOne({ token: accessToken })
        .then((isBlacklisted) => {
            if (isBlacklisted) {
                res.status(401).send({ success: false, message: "Token is blacklisted. Please log in again." });
                return;
            }

            next();
        })
        .catch(() => {
            res.status(500).send({ success: false, message: "Internal Server Error." });
        });
    console.log('blacklist middleware crossed')

}

export default authenticateBlackList;



