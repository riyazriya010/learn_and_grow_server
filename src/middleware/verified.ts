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

const isUserVerified = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
    try{
        const token = req.cookies['accessToken']
        const decodedToken: any = jwt.decode(token)
        const { user, role } = decodedToken
        console.log('decodedToken: ', decodedToken)
        if(role === 'student'){
            console.log('enter1')
            const findUser = await UserModel.findById(user) as unknown as IUser
            const isStudentVerify = findUser?.isVerified
            // const isStudentVerify = await userRepository.isVerified(user)
            if(!isStudentVerify){
                console.log('enter2')
                return res
                .status(401).send({
                    message: 'Student Not Verified',
                    success: true
                })
            }
        }else if(role === 'mentor'){
            const findUser = await MentorModel.findById(user) as unknown as IMentor
            const isMentorVerify = findUser?.isVerified
            // const isMentorVerify = await mentorRepository.isVerified(user)
            if(!isMentorVerify){
                return res
                .status(401).send({
                    message: 'Mentor Not Verified',
                    success: true
                })
            }
        }
        next()
    }catch(error){
        console.log('Verify User checking error')
    }
}

export default isUserVerified