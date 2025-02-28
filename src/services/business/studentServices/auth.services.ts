import { StudentProfileInput, StudentSignUpInput } from "../../../interface/students/student.types";
import { IUser } from "../../../models/user.model";
import bcrypt from 'bcrypt'
import StudentAuthRepository from "../../../repositories/entities/studentRepository/auth.repository";
import { generateAccessToken, verifyToken } from "../../../integration/mailToken";
import Mail from "../../../integration/nodemailer";
import StudentRepository from "../../../repositories/entities/student.repository";
import StudentServices from "../student.services";
import { STUDENT_PORT_LINK } from "../../../utils/constants";


export default class StudentAuthServices {
    private studentAuthRepository: StudentAuthRepository

    constructor(studentAuthRepository: StudentAuthRepository) {
        this.studentAuthRepository = studentAuthRepository;
    }

    async studentLogin(email: string, password: string): Promise<IUser | null> {
        try {
            const loginUser = await this.studentAuthRepository.studentLogin(email, password)
            return loginUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentSignUp(data: StudentSignUpInput): Promise<any | null> {
        try {
            const hashPassword = await bcrypt.hash(data.password, 10)
            data.password = hashPassword

            const addUser = await this.studentAuthRepository.studentSignUp(data)

            const token = await generateAccessToken({ id: String(addUser?._id), email: String(addUser?.email) })
            const portLink = STUDENT_PORT_LINK
            console.log('verify link :::: ', portLink)
            const createdLink = `${portLink}?token=${token}`
            const mail = new Mail()
            mail.sendVerificationEmail(String(addUser?.email), createdLink)
                .then(info => {
                    console.log('Verification email sent successfully: ');
                })
                .catch(error => {
                    console.error('Failed to send verification email:', error);
                });

            return addUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGoogleSignUp(email: string, displayName: string): Promise<IUser | null> {
        try {
            const addStudent = await this.studentAuthRepository.studentGoogleSignUp({ email, displayName })
            return addStudent
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGoogleLogin(email: string): Promise<IUser | null> {
        try {
            const logUser = await this.studentAuthRepository.studentGoogleLogin(email)
            return logUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentForgetPassword(email: string, password: string): Promise<IUser | null> {
        try {
            const hashPassword = await bcrypt.hash(password, 10)
            password = hashPassword
            const updatePassword = await this.studentAuthRepository.studentForgetPassword(email, password)
            return updatePassword
        } catch (error: unknown) {
            throw error
        }
    }

    // async studentVerify(otp: string, email: string): Promise<any | null> {
    async studentVerify(token: string): Promise<any | null> {
        try {
            const verifiedToken = await verifyToken(token)
            if (!verifiedToken.status) {
                const error = new Error('Token Expired')
                error.name = 'tokenExpired'
                throw error
            }

            const payload = verifiedToken.payload;
            if (!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)) {
                const error = new Error('Invalid token payload')
                error.name = 'Invalidtokenpayload'
                throw error
            }
            const { email } = payload;
            // const verifyUser = await this.studentAuthRepository.studentVerify(otp, email)

            const verifyUser = await this.studentAuthRepository.studentVerify(email)
            return verifyUser

        } catch (error: unknown) {
            throw error
        }
    }

    async studentProfleUpdate(studentId: string, data: StudentProfileInput): Promise<IUser | null> {
        try {
            const updateUser = await this.studentAuthRepository.studentProfleUpdate(studentId, data)
            return updateUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentReVerify(email: string): Promise<any | null> {
        try {
            const findUser = await this.studentAuthRepository.studentReVerify(email)
            const token = await generateAccessToken({ id: String(findUser?._id), email: email })
            const portLink = STUDENT_PORT_LINK
            const createdLink = `${portLink}?token=${token}`
            const mail = new Mail()
            mail.sendVerificationEmail(email, createdLink)
                .then(info => {
                    console.log('Verification email sent successfully:');
                })
                .catch(error => {
                    console.error('Failed to send verification email:', error);
                });
            return findUser
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCheck(studentId: string): Promise<IUser | null> {
        try {
            const checkStudent = await this.studentAuthRepository.studentCheck(studentId)
            return checkStudent
        } catch (error: unknown) {
            throw error
        }
    }
}


const authRepository = new StudentAuthRepository()
export const authServices = new StudentAuthServices(authRepository)
