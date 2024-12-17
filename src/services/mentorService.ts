import { mentorSignUpData } from "../interface/mentor.type"
import { IMentor } from "../models/mentor.model"
import { MentorRepository } from "../repositories/mentorRepository"

export class MentorServices {
    private mentorRepository: MentorRepository

    constructor(){
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
}