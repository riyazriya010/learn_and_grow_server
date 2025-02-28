import { IMentorAuthMethods } from "../../../interface/mentors/mentor.interface";
import { MentorProfileUpdateInput, MentorSignUpInput } from "../../../interface/mentors/mentor.types";
import MentorModel, { IMentor } from "../../../models/mentor.model";
import MentorAuthBaseRepository from "../../baseRepositories/mentorBaseRepositories/authBaseRepository";


export default class MentorAuthRepository extends MentorAuthBaseRepository<{
    Mentor: IMentor
}> implements IMentorAuthMethods {

    constructor() {
        super({
            Mentor: MentorModel
        })
    }

    
    async mentorLogin(email: string, password: string): Promise<IMentor | null> {
        try {
            const logUesr = await this.findOne('Mentor',{ email: email })
            return logUesr
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorSignUp(userData: MentorSignUpInput): Promise<IMentor | null> {
        try {
            const existUser = await this.findOne('Mentor',{ email: userData.email })
            if (existUser) {
                const error = new Error('Mentor Already Exist')
                error.name = 'MentorExist'
                throw error
            }

            const { username, email, phone, password, expertise, skills } = userData;
            const modifiedUser = {
                username,
                email,
                phone,
                password,
                expertise,
                skills,
                role: 'mentor',
            };
            const newMentor = await this.createData('Mentor', modifiedUser)
            await newMentor.save()
            return newMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGoogleSignUp(email: string, displayName: string): Promise<IMentor | null> {
        try {
            const existMentor = await this.findOne('Mentor',{ email })
            if (existMentor) {
                const error = new Error('Mentor Already Exist')
                error.name = 'MentorExist'
                throw error
            }

            const data = {
                username: displayName,
                email,
                phone: 'Not Provided',
                expertise: 'Not Provided',
                skills: 'Not Provided',
                password: 'null',
                role: 'mentor',
                isVerified: true
            }
            const document = await this.createData('Mentor', data)
            const savedMentor = await document.save()
            return savedMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGoogleLogin(email: string): Promise<IMentor | null> {
        try {
            const logMentor = await this.findOne('Mentor',{ email })
            return logMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorForgetPassword(email: string, password: string): Promise<IMentor | null> {
        try {
            const findMentor = await this.findOne('Mentor',{ email })
            if (!findMentor) {
                const error = new Error("Mentor Not Found")
                error.name = "MentorNotFound"
                throw error
            }
            findMentor.password = password
            await findMentor.save()
            return findMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorProfileUpdate(userId: string, userData: MentorProfileUpdateInput): Promise<IMentor | null> {
        try {
            const mentorData: any = {
                username: userData.username,
                phone: userData.phone,
            }
            if (userData.profilePicUrl) {
                mentorData.profilePicUrl = userData.profilePicUrl
            }
            const updatedProfile = await this.updateById('Mentor', userId, mentorData);
            return updatedProfile
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorCheck(userId: string): Promise<IMentor | null> {
        try {
            const checkMentor = await this.findById('Mentor',userId)
            return checkMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorVerify(email: string): Promise<IMentor | null> {
        try {
            const findUser = await this.findOne('Mentor',{ email }) as IMentor
            findUser.isVerified = true
            const verifiyedUser = await findUser.save()
            return verifiyedUser
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorReVerify(email: string): Promise<IMentor | null> {
        try {
            const findUser = await this.findOne('Mentor',{ email }) as IMentor
            // findUser.isVerified = true
            // const verifiyedUser = await findUser.save()
            return findUser
        } catch (error: unknown) {
            throw error
        }
    }


}

