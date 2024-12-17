import { mentorSignUpData } from "../interface/mentor.type";
import MentorModel, { IMentor } from "../models/mentor.model";
import MentorBaseRepository from "./baseRepo/mentorBase.repository";

export class MentorRepository {
    private baseRepository: MentorBaseRepository<IMentor>

    constructor(){
        this.baseRepository = new MentorBaseRepository<IMentor>(MentorModel)
    }

    async findByEmail(email: string): Promise<IMentor | null>{
        const response = await this.baseRepository.findByEmail(email)
        return response
    }
    
    async mentorSignUp(data: mentorSignUpData): Promise<IMentor | null> {
        const response = await this.baseRepository.mentorSignUp(data)
        return response
    }
}