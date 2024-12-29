import jwt from 'jsonwebtoken';
import { Request } from 'express';


export interface CustomRequest extends Request {
    user?: { id: string; role?: string };
}

const getId = (token: string, req: CustomRequest): string | null => {
    try {
        const accessToken = req.cookies[token]
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

