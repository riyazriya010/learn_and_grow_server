import { mentorSignUpData } from "../interface/mentor.type"
import { IMentor } from "../models/mentor.model"
import { MentorRepository } from "../repositories/mentorRepository"

export class MentorServices {
    private mentorRepository: MentorRepository

    constructor() {
        this.mentorRepository = new MentorRepository()
    }

    public async findByEmail(email: string): Promise<IMentor | null> {
        const response = await this.mentorRepository.findByEmail(email)
        return response
    }

    public async mentorSignUp(data: mentorSignUpData): Promise<IMentor | null> {
        const response = await this.mentorRepository.mentorSignUp(data)
        return response
    }

    public async mentorLogin(email: string, password: string): Promise<IMentor | null> {
        const loggedUser = await this.mentorRepository.mentorLogin(email, password)
        return loggedUser
    }

    public async forgetPassword(data: any): Promise<IMentor | null | any> {
        const response = await this.mentorRepository.forgetPassword(data)
        return response
    }

    public async mentorGoogleLogin(email: string): Promise<IMentor | null> {
        const addStudent = await this.mentorRepository.mentorGoogleLogin(email)
        return addStudent
    }

    public async mentorGoogleSignUp(email: string, displayName: string): Promise<IMentor | null> {
        const addStudent = await this.mentorRepository.mentorGoogleSignUp(email, displayName)
        return addStudent
    }

    public async profileUpdate(id: string, data: any): Promise<any> {
        const response = await this.mentorRepository.profileUpdate(id, data)
        return response
    }

    public async checkMentor(id: string): Promise<any>{
        const response = await this.mentorRepository.checkMentor(id)
        return response
    }

    public async isUserBlocked(email: string): Promise<boolean> {
        const response  = await this.mentorRepository.isUserBlocked(email)
        return response
    }

    public async mentorReVerify(email: string): Promise<any>{
        const response = await this.mentorRepository.mentorReVerify(email)
        return response
    }

     public async verifyMentor(email: string): Promise<IMentor | null>{
            const response = await this.mentorRepository.verifyMentor(email)
            return response
        }
}