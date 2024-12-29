import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import UserRepositories from '../repositories/userRepository';
import { MentorRepository } from '../repositories/mentorRepository';

interface AuthenticatedRequest extends Request {
    user?: {
        user: string;
        role: string;
        iat: number;
        exp: number;
    };
}

const userRepository = new UserRepositories()
const mentorRepository = new MentorRepository()

const isUserBlocked = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    try{
        const token = req.cookies['accessToken']
        const decodedToken: any = jwt.decode(token)
        const { user, role } = decodedToken
        console.log('decodedToken: ', decodedToken)
        if(role === 'student'){
            console.log('enter1')
            const isStudentBlock = await userRepository.isBlocked(user)
            if(isStudentBlock){
                console.log('enter2')
                return res
                .status(403).send({
                    message: 'Student Blocked',
                    success: true
                })
            }
        }else if(role === 'mentor'){
            const isMentorBlock = await mentorRepository.isBlocked(user)
            if(isMentorBlock){
                return res
                .status(403).send({
                    message: 'Mentor Blocked',
                    success: true
                })
            }
        }
        next()
    }catch(error){
        console.log('Block User checking error')
    }
}

export default isUserBlocked