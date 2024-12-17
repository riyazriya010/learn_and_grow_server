import { Request, Response } from "express"
import { MentorServices } from "../services/mentorService"

export class MentorController {
    private mentorServices: MentorServices

    constructor(){
        this.mentorServices = new MentorServices()
    }

    public async mentorSignUp(req: Request, res: Response):  Promise<any> {
        try {
            const { 
                username,
                email,
                phone,
                password,
                expertise,
                skills
             } = req.body

             const ExistMentor = await this.mentorServices.findByEmail(email)

             if(ExistMentor){
                return res.status(409).send({ message: 'Mentor Already Exist', success: false })
             }

             const addedMentor = await this.mentorServices.mentorSignUp({
                username, email, phone, password, expertise, skills
             })

             return res.status(201).send({user: addedMentor, message: 'Mentor Added Successfully', success: true })

        } catch (error: any) {
            console.log(error.message)
        }
    }
}