import { Request, Response } from "express"
import { MentorServices } from "../services/mentorService"
import { JwtService } from "../integration/jwt"

export class MentorController {
    private mentorServices: MentorServices
    private jwtService: JwtService

    constructor(){
        this.mentorServices = new MentorServices()
        this.jwtService = new JwtService()
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

             if(addedMentor){

                const userJwtToken = await this.jwtService.createToken(addedMentor._id, addedMentor.role)
                const userRefreshToken = await this.jwtService.createRefreshToken(addedMentor._id, addedMentor.role)
               
                return res
                .status(201)
                .cookie('accessToken', userJwtToken, {
                    httpOnly: false
                }).cookie('refreshToken', userRefreshToken, {
                    httpOnly: true
                })
                .send({
                    success: true,
                    message: 'Mentor Added Successfully',
                    user: addedMentor
                })
             }

            //  return res.status(201).send({user: addedMentor, message: 'Mentor Added Successfully', success: true })

        } catch (error: any) {
            console.log(error.message)
        }
    }

    public async sample(req: Request, res: Response): Promise<any>{
        try {
            console.log('reqqqq: ', req.body)
            return res.status(200).send({ message: 'Sample', success: true})
        } catch (error) {
            console.log(error)
        }
    }
}