import { generateAccessToken } from "../../../integration/mailToken";
import Mail from "../../../integration/nodemailer";
import { MentorProfileUpdateInput, MentorSignUpInput } from "../../../interface/mentors/mentor.types";
import { IMentor } from "../../../models/mentor.model";
import MentorAuthRepository from "../../../repositories/entities/mentorRepositories/auth.repository";
import bcrypt from "bcrypt";
import { MENTOR_PORT_LINK } from "../../../utils/constants";

export default class MentorAuthServices {
    private mentorAuthRepository: MentorAuthRepository

    constructor(mentorAuthRepository: MentorAuthRepository) {
        this.mentorAuthRepository = mentorAuthRepository;
    }


    async mentorLogin(email: string, password: string): Promise<IMentor | null> {
        try {
            const logUser = await this.mentorAuthRepository.mentorLogin(email, password)

            if (!logUser) {
                const error = new Error('Email Not Found')
                error.name = 'EmailNotFound'
                throw error
            }

            const isPassword = await bcrypt.compare(password, logUser.password)
            if (!isPassword) {
                const error = new Error('Password Invalid')
                error.name = 'PasswordInvalid'
                throw error
            }

            if (logUser.isBlocked) {
                const error = new Error('Mentor Blocked')
                error.name = 'MentorBlocked'
                throw error
            }

            return logUser

        } catch (error: unknown) {
            throw error
        }
    }

    async mentorSignUp(data: MentorSignUpInput): Promise<IMentor | null> {
        try {
            const hashPassword = await bcrypt.hash(data.password, 10)
            data.password = hashPassword
            const addedMentor = await this.mentorAuthRepository.mentorSignUp(data)

            const token = await generateAccessToken({ id: String(addedMentor?._id), email: String(addedMentor?.email) })
            const portLink = MENTOR_PORT_LINK
            const createdLink = `${portLink}?token=${token}`
            const mail = new Mail()
            mail.sendVerificationEmail(String(addedMentor?.email), createdLink)
                .then(info => {
                    console.log('Verification email sent successfully:');
                })
                .catch(error => {
                    console.error('Failed to send verification email:', error);
                });
            return addedMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGoogleSignUp(email: string, displayName: string): Promise<IMentor | null> {
        try {
            const addedMentor = await this.mentorAuthRepository.mentorGoogleSignUp(email, displayName)
            return addedMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGoogleLogin(email: string): Promise<IMentor | null> {
        try {
            const logMentor = await this.mentorAuthRepository.mentorGoogleLogin(email)

            if (!logMentor) {
                const error = new Error('Email Not Found')
                error.name = 'EmailNotFound'
                throw error
            }

            if (logMentor.isBlocked) {
                const error = new Error('Mentor Blocked')
                error.name = 'MentorBlocked'
                throw error
            }

            return logMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorForgetPassword(email: string, password: string): Promise<IMentor | null> {
        try {
            const hashPassword = await bcrypt.hash(password, 10)
            password = hashPassword
            const updatedMentor = await this.mentorAuthRepository.mentorForgetPassword(email, password)
            return updatedMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorProfileUpdate(userId: string, data: MentorProfileUpdateInput): Promise<IMentor | null> {
        try {
            const updatedProfile = await this.mentorAuthRepository.mentorProfileUpdate(userId, data)
            return updatedProfile
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorCheck(userId: string): Promise<IMentor | null> {
        try {
            const checkMentor = await this.mentorAuthRepository.mentorCheck(userId)
            return checkMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorVerify(email: string): Promise<IMentor | null> {
        try {
            const verifyUser = await this.mentorAuthRepository.mentorVerify(email)
            return verifyUser
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorReVerify(email: string): Promise<IMentor | null> {
        try {
            const verifiedUser = await this.mentorAuthRepository.mentorReVerify(email)
            return verifiedUser
        } catch (error: unknown) {
            throw error
        }
    }


}

const mentorAuthRepository = new MentorAuthRepository()
export const mentorAuthServices = new MentorAuthServices(mentorAuthRepository)