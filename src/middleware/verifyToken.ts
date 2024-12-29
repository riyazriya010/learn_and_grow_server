
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { JWT_SECRET } from '../utils/constants';

interface AuthenticatedRequest extends Request {
    user?: {
        user: string;
        role: string;
        iat: number;
        exp: number;
    };
}

const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    console.log('Auth middleware entered');

    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];
    console.log('Cookies received:', req.cookies);
    console.log('accessToken: ', accessToken)
    if (!accessToken) {
        return res
            .status(401)
            .send({ failToken: true, message: 'No access token provided' });
    }

    try {
        // Verify Access Token
        const accessPayload = jwt.verify(
            accessToken,
            JWT_SECRET as string
        ) as AuthenticatedRequest['user'];

        // If valid, attach payload to request and proceed
        console.log('acssss')
        req.user = accessPayload;
        return next();
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            console.log('Access token expired');

            if (!refreshToken) {
                console.log('Refresh not having')
                return res
                    .status(401)
                    .send({ failToken: true, message: 'No refresh token provided' });
            }

            // Verify Refresh Token
            try {
                const refreshPayload = jwt.verify(
                    refreshToken,
                    JWT_SECRET as string
                ) as AuthenticatedRequest['user'] | undefined;

                if (!refreshPayload) {
                    return res
                        .status(401)
                        .send({ message: 'Invalid refresh token. Please log in.' });
                }

                // Generate a new Access Token
                const newAccessToken = jwt.sign(
                    { user: refreshPayload.user, role: refreshPayload.role },
                    JWT_SECRET as string,
                    { expiresIn: '1h' }
                );
                console.log(' new  acssss')
                // Set new Access Token in cookies
                res.cookie('accessToken', newAccessToken, { httpOnly: true });

                // Attach payload to request
                req.user = refreshPayload;
                return next();
            } catch (refreshErr: any) {
                if (refreshErr.name === 'TokenExpiredError') {
                    console.log('Refresh token expired');
                    return res
                        .status(401)
                        .send({ message: 'Session expired. Please log in again.' });
                }

                console.log('Invalid refresh token');
                return res
                    .status(401)
                    .send({ message: 'Invalid refresh token. Please log in.' });
            }
        }

        console.log('Invalid access token');
        return res
            .status(400)
            .send({ message: 'Invalid access token. Please log in.' });
    }
};

export default authenticateToken;
