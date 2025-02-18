import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
// import UserRepositories from '../repositories/userRepository';
// import { MentorRepository } from '../repositories/mentorRepository';
import UserModel, { IUser } from '../models/user.model';
import MentorModel, { IMentor } from '../models/mentor.model';

interface AuthenticatedRequest extends Request {
    user?: {
        user: string;
        role: string;
        iat: number;
        exp: number;
    };
}

// const userRepository = new UserRepositories()
// const mentorRepository = new MentorRepository()

const isUserBlocked = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    try{
        const token = req.cookies['accessToken']
        const decodedToken: any = jwt.decode(token)
        const { user, role } = decodedToken
        console.log('decodedToken: ', decodedToken)
        if(role === 'student'){
            console.log('enter1')
            const findUser = await UserModel.findById(user) as unknown as IUser
            const isStudentBlock = findUser?.isBlocked
            // const isStudentBlock = await userRepository.isBlocked(user)
            if(isStudentBlock){
                console.log('enter2')
                return res
                .status(403).send({
                    message: 'Student Blocked',
                    success: true
                })
            }
        }else if(role === 'mentor'){
            const findUser = await MentorModel.findById(user) as unknown as IMentor
            const isMentorBlock = findUser?.isBlocked
            // const isMentorBlock = await mentorRepository.isBlocked(user)
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