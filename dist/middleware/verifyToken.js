"use strict";
// import jwt from 'jsonwebtoken'
// import { NextFunction, Request, Response } from 'express'
// import { JWT_SECRET } from '../utils/constants'
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// interface AuthenticatedRequest extends Request {
//     user?:{
//         user: string,
//         role: string,
//         iat: number,
//         exp: number
//     }
// }
// const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
//     console.log('auth enteredddd')
//     const accessToken = req.cookies['accessToken']
//     const refreshToken = req.cookies['refreshToken']
//     if (!accessToken) {
//         return res.status(401).send({ failToken: true, message: 'No access token provided' });
//     }
//     try {
//         if (accessToken) {
//             // const verified = jwt.verify(accessToken, JWT_SECRET as string) as {
//             //     user: string;
//             //     role: string;
//             //     iat: number;
//             //     exp: number;
//             // };
//             // console.log('verified acessTkn', verified)
//             // req.user = verified; 
//             // return next();
//             const accessVerify = jwt.verify(accessToken, String(JWT_SECRET), (err: any, decoded: any) => {
//                 if (err) {
//                     if (err.name === 'TokenExpiredError') {
//                         return 'Token Expired';
//                     } else {
//                         return 'Invalid Token';
//                     }
//                 }
//                 return decoded            
//             })
//             if(accessToken === 'Token Expired'){
//                 if(!refreshToken){
//                     return res.status(401).send({ failToken: true, message: 'No refresh token provided' });
//                 }
//                 const refreshVerify = jwt.verify(refreshToken, String(JWT_SECRET), (err: any, decoded: any) => {
//                     if (err) {
//                         if (err.name === 'TokenExpiredError') {
//                             return 'Token Expired';
//                         } else {
//                             return 'Invalid Token';
//                         }
//                     }
//                     return decoded
//                 })
//                 if(refreshVerify === 'Token Expired'){
//                     return res.status(401).send({ message: 'Unauthorized. Please log in.' });
//                 }
//                 const newAccessToken = jwt.sign(
//                     { user: refreshVerify.user, role: refreshVerify.role },
//                     JWT_SECRET,
//                     { expiresIn: '1h' }
//                 );
//                 res.cookie('userAccessToken', newAccessToken, { httpOnly: true });
//                 req.user = refreshVerify; 
//                 return next();
//             }else if(accessVerify === 'Invalid'){
//                 return res.status(400).send({ message: 'Invalid Access token'});
//             }
//         }
//         // if (refreshToken) {
//         //     console.log('refresss')
//         //     const verified = jwt.verify(refreshToken, JWT_SECRET as string) as {
//         //         user: string;
//         //         role: string;
//         //         iat: number;
//         //         exp: number;
//         //     };
//         //     console.log('verified refreshTkn', verified)
//         //     const newAccessToken = jwt.sign(
//         //         { user: verified.user, role: verified.role },
//         //         JWT_SECRET,
//         //         { expiresIn: '1h' }
//         //     );
//         //     res.cookie('userAccessToken', newAccessToken, { httpOnly: true });
//         //     req.user = verified; 
//         //     return next();
//         // }
//         // return res.status(401).send({ message: 'Unauthorized. Please log in.' });
//     } catch (error) {
//         console.log('404 tockn')
//         return res.status(400).send({ message: 'Invalid token', error: error });
//     }
// }
// export default authenticateToken
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../utils/constants");
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Auth middleware entered');
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];
    if (!accessToken) {
        return res
            .status(401)
            .send({ failToken: true, message: 'No access token provided' });
    }
    try {
        // Verify Access Token
        const accessPayload = jsonwebtoken_1.default.verify(accessToken, constants_1.JWT_SECRET);
        // If valid, attach payload to request and proceed
        req.user = accessPayload;
        return next();
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            console.log('Access token expired');
            if (!refreshToken) {
                return res
                    .status(401)
                    .send({ failToken: true, message: 'No refresh token provided' });
            }
            // Verify Refresh Token
            try {
                const refreshPayload = jsonwebtoken_1.default.verify(refreshToken, constants_1.JWT_SECRET);
                if (!refreshPayload) {
                    return res
                        .status(401)
                        .send({ message: 'Invalid refresh token. Please log in.' });
                }
                // Generate a new Access Token
                const newAccessToken = jsonwebtoken_1.default.sign({ user: refreshPayload.user, role: refreshPayload.role }, constants_1.JWT_SECRET, { expiresIn: '1h' });
                // Set new Access Token in cookies
                res.cookie('accessToken', newAccessToken, { httpOnly: true });
                // Attach payload to request
                req.user = refreshPayload;
                return next();
            }
            catch (refreshErr) {
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
});
exports.default = authenticateToken;
