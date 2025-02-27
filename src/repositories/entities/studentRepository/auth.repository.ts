import { generateRandomFourDigitNumber } from "../../../integration/mailToken";
import Mail from "../../../integration/nodemailer";
import { IStudentAuthMethods } from "../../../interface/students/student.interface";
import { StudentGoogleSignupInput, StudentProfileInput, StudentSignUpInput } from "../../../interface/students/student.types";
import { IOtp, OTPModel } from "../../../models/otp.model";
import UserModel, { IUser } from "../../../models/user.model";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";
import StudentAuthBaseRepository from "../../baseRepositories/studentBaseRepositories/studentAuthBaseRepository";
import bcrypt from 'bcrypt'


export default class StudentAuthRepository extends CommonBaseRepository<{
    UserModel: IUser;
    Otp: IOtp
}> implements IStudentAuthMethods {

    constructor() {
        super({
            UserModel: UserModel,
            Otp: OTPModel
        })
    }

    async studentLogin(email: string, password: string): Promise<IUser | null> {
        try {
            const findUser = await this.findOne('UserModel', { email: email })
            console.log('findUser: ', findUser)
            if (!findUser) {
                const error = new Error('Email Not Found')
                error.name = 'EmailNotFound'
                throw error
            }

            const isPassword = await bcrypt.compare(password, findUser.password)
            if (!isPassword) {
                const error = new Error('Password Invalid')
                error.name = 'PasswordInvalid'
                throw error
            }

            if (findUser.isBlocked) {
                const error = new Error('Student Blocked')
                error.name = 'StudentBlocked'
                throw error
            }
            return findUser

        } catch (error: unknown) {
            throw error
        }
    }

    async studentSignUp(userData: StudentSignUpInput): Promise<any | null> {
        try {
            const { username, email, phone, password } = userData

            const existUser = await this.findOne('UserModel', { email: userData.email })
            if (existUser) {
                const error = new Error('User Already Exist')
                error.name = 'UserExist'
                throw error
            }

            const modifiedUser = {
                username,
                email,
                phone,
                password,
                role: 'student',
                studiedHours: 0,
            };

            const addUser = await this.createData('UserModel', modifiedUser as unknown as Partial<IUser>)

            // create otp
            const otp = await generateRandomFourDigitNumber()

            const otpData = {
                email,
                otp: String(otp)
            }
            const createdOtp = await this.createData('Otp', otpData)

            const mail = new Mail()
            mail.sendVerificationEmail(String(email), String(otp))
                .then(info => {
                    console.log('Otp email sent successfully: ');
                })
                .catch(error => {
                    console.error('Failed to send Otp email:', error);
                });
            console.log('createdOtp ::: ', createdOtp)
            return {
                addUser,
                createdOtp
            }
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGoogleSignUp(userData: StudentGoogleSignupInput): Promise<IUser | null> {
        try {
            const existUser = await this.findOne('UserModel', { email: userData.email })
            if (existUser) {
                const error = new Error('User Already Exist')
                error.name = 'UserExist'
                throw error
            }

            const modifiedUser = {
                username: userData.displayName,
                email: userData.email,
                phone: 'Not Provided',
                studiedHours: 0,
                password: 'null',
                role: 'student',
                isVerified: true
            }
            const addUser = await this.createData('UserModel', modifiedUser as unknown as Partial<IUser>)
            return addUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGoogleLogin(email: string): Promise<IUser | null> {
        try {
            const findUser = await this.findOne('UserModel', { email: email })
            if (!findUser) {
                const error = new Error('User Not Found')
                error.name = 'UserNotFound'
                throw error
            }
            return findUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentForgetPassword(email: string, password: string): Promise<IUser | null> {
        try {
            const findUser = await this.findOne('UserModel', { email: email })
            if (!findUser) {
                const error = new Error('User Not Found')
                error.name = 'UserNotFound'
                throw error
            }
            findUser.password = password
            await findUser.save()
            return findUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentVerify(otp: string, email: string): Promise<any | null> {
        try {
            const verifyOtp = await this.findOne('Otp', {email, otp })
            if (!verifyOtp) {
                const error = new Error('Otp Not Found')
                error.name = 'OtpNotFound'
                throw error
            }
            return verifyOtp

            // const findUser = await this.findOne('UserModel',{email: email})
            // if (!findUser) {
            //     const error = new Error('User Not Found')
            //     error.name = 'UserNotFound'
            //     throw error
            // }

            // findUser.isVerified = true
            // await findUser.save()
            // return findUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentProfleUpdate(studentId: string, userData: StudentProfileInput): Promise<IUser | null> {
        try {
            // const updateUser = await this.findByIdAndUpdate(studentId, userData)
            const updateUser = await this.updateById('UserModel', studentId, userData)
            return updateUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentReVerify(email: string): Promise<IUser | null> {
        try {
            const findUser = await this.findOne('UserModel', { email: email })
            if (!findUser) {
                const error = new Error('User Not Found')
                error.name = 'UserNotFound'
                throw error
            }
            return findUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCheck(studentId: string): Promise<IUser | null> {
        try {
            // const findUser = await this.findById(studentId)
            const findUser = await this.findById('UserModel', studentId)
            return findUser
        } catch (error: unknown) {
            throw error
        }
    }

}

