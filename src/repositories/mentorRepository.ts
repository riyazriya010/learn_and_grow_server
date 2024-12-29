import { mentorSignUpData } from "../interface/mentor.type";
import MentorModel, { IMentor } from "../models/mentor.model";
import MentorBaseRepository from "./baseRepo/mentorBase.repository";

export class MentorRepository {
    private baseRepository: MentorBaseRepository<IMentor>

    constructor() {
        this.baseRepository = new MentorBaseRepository<IMentor>(MentorModel)
    }

    async findByEmail(email: string): Promise<IMentor | null> {
        const response = await this.baseRepository.findByEmail(email)
        return response
    }

    async mentorSignUp(data: mentorSignUpData): Promise<IMentor | null> {
        const response = await this.baseRepository.mentorSignUp(data)
        return response
    }

    async mentorLogin(email: string, password: string): Promise<IMentor | null> {
        const loggedUser = await this.baseRepository.mentorLogin(email, password)
        return loggedUser
    }

    async forgetPassword(data: any): Promise<IMentor | null | any> {
        const response = await this.baseRepository.forgetPassword(data)
        return response
    }


    public async mentorGoogleLogin(email: string): Promise<IMentor | null> {
        const addedUser = await this.baseRepository.mentorGoogleLogin(email)
        return addedUser
    }

    public async mentorGoogleSignUp(email: string, displayName: string): Promise<IMentor | null> {
        const addedUser = await this.baseRepository.mentorGoogleSignUp(email, displayName)
        return addedUser
    }

    public async profileUpdate(id: string, data: any): Promise<any> {
        const response = await this.baseRepository.profileUpdate(id, data)
        return response
    }

    public async checkMentor(id: string): Promise<any> {
        const response = await this.baseRepository.checkStudent(id)
        return response
    }

    public async isUserBlocked(email: string): Promise<boolean> {
        const response = await this.baseRepository.isUserBlocked(email)
        return response
    }

    public async mentorReVerify(email: string): Promise<any> {
        const response = await this.baseRepository.mentorReVerify(email)
        return response
    }

    public async verifyMentor(email: string): Promise<IMentor | null> {
        const response = await this.baseRepository.verifyMentor(email)
        return response
    }

    public async isBlocked(id: string): Promise<boolean> {
        const response = await this.baseRepository.isBlocked(id)
        return response
    }

    public async isVerified(id: string): Promise<boolean> {
        const response = await this.baseRepository.isVerified(id)
        return response
    }


}