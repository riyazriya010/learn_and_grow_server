import { Document, Model } from "mongoose"
import { IMentor } from "../../models/mentor.model"
import { mentorSignUpData } from "../../interface/mentor.type"


export default class MentorBaseRepository<T extends Document> {
    private model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async findByEmail(email: string): Promise<IMentor | null> {
        return await this.model.findOne({ email: email })
    }

    async mentorSignUp(data: mentorSignUpData): Promise<IMentor | null> {
        try{
            const modifiedData = { ...data, role: 'mentor' }
            const document = new this.model(modifiedData)
            const savedUser = await document.save()
            return savedUser as unknown as IMentor

        }catch(error: any){
            console.log(error.message)
            return null
        }
    }

}