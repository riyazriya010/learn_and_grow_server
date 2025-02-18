import { IStudentAuthMethods } from "../../../interface/students/student.interface";
import { StudentGoogleSignupInput, StudentProfileInput, StudentSignUpInput } from "../../../interface/students/student.types";
import UserModel, { IUser } from "../../../models/user.model";
import StudentAuthBaseRepository from "../../baseRepositories/studentBaseRepositories/studentAuthBaseRepository";
import bcrypt from 'bcrypt'


export default class StudentAuthRepository extends StudentAuthBaseRepository<IUser> implements IStudentAuthMethods {
    constructor() {
        super(UserModel)
    }

    async studentLogin(email: string, password: string): Promise<IUser | null> {
        try {
            const findUser = await this.findByEmail(email)
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

    async studentSignUp(userData: StudentSignUpInput): Promise<IUser | null> {
        try {
            const { username, email, phone, password } = userData

            const existUser = await this.findByEmail(userData.email)
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

            const addUser = await this.createStudent(modifiedUser)
            return addUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGoogleSignUp(userData: StudentGoogleSignupInput): Promise<IUser | null> {
        try {
            const existUser = await this.findByEmail(userData.email)
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
            const addUser = await this.createStudent(modifiedUser)
            return addUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGoogleLogin(email: string): Promise<IUser | null> {
        try {
            const findUser = await this.findByEmail(email)
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
            const findUser = await this.findByEmail(email)
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

    async studentVerify(email: string): Promise<IUser | null> {
        try {
            const findUser = await this.findByEmail(email)
            if (!findUser) {
                const error = new Error('User Not Found')
                error.name = 'UserNotFound'
                throw error
            }

            findUser.isVerified = true
            await findUser.save()
            return findUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentProfleUpdate(studentId: string, userData: StudentProfileInput): Promise<IUser | null> {
        try{
            const updateUser = await this.findByIdAndUpdate(studentId, userData)
            return updateUser
        }catch(error: unknown){
            throw error
        }
    }

    async studentReVerify(email: string): Promise<IUser | null> {
        try{
            const findUser = await this.findByEmail(email)
            if (!findUser) {
                const error = new Error('User Not Found')
                error.name = 'UserNotFound'
                throw error
            }
            return findUser
        }catch(error: unknown){
            throw error
        }
    }

    async studentCheck(studentId: string): Promise<IUser | null> {
        try{
            const findUser = await this.findById(studentId)
            return findUser
        }catch(error: unknown){
            throw error
        }
    }

}

