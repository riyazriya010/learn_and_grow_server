import jwt from 'jsonwebtoken';
import { Request } from 'express';


export interface CustomRequest extends Request {
    user?: {
        user: string;
        role: string;
        iat: number;
        exp: number;
    };
}

const getId = (token: string, req: CustomRequest): string | null => {
    try {
        const accessToken = req.cookies['accessToken']
        console.log('acc', accessToken)
        const decodedData: any = jwt.decode(accessToken)
        const { user } = decodedData
        return user
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;  // Return null if there's any error
    }
}

export default getId;

