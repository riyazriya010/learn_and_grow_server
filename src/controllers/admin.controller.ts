import { Request, Response } from "express";
import { AdminServices } from "../services/adminService";
import { JwtService } from "../integration/jwt";

export class AdminController {
    private adminServices: AdminServices
    private jwtService: JwtService

    constructor() {
        this.adminServices = new AdminServices()
        this.jwtService = new JwtService()
    }

    async adminLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body

            if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD){
                return res.status(409).send({
                    message: 'Invalid Credential',
                    success: false
                })
            }

            const userJwtToken = await this.jwtService.createToken(String(email), 'admin')
            const userRefreshToken = await this.jwtService.createRefreshToken(String(email), 'admin')

            return res
                .status(200)
                .cookie('accessToken', userJwtToken, {
                    httpOnly: false
                }).cookie('refreshToken', userRefreshToken, {
                    httpOnly: true
                })
                .send({
                    success: true,
                    message: 'Admin Found Successfully',
                })

        } catch (error) {
            console.log(error)
        }
    }

    async getUsers(req: Request, res: Response): Promise<any> {
        try {
            const response = await this.adminServices.getUsers()
            if (response) {
                return res
                    .status(200)
                    .send({
                        users: response,
                        message: 'Users Got it',
                        success: true
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getMentors(req: Request, res: Response): Promise<any> {
        try {
            const response = await this.adminServices.getMentors()
            if (response) {
                return res
                    .status(200)
                    .send({
                        mentors: response,
                        message: 'Mentors Got it',
                        success: true
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }

    async blockMentor(req: Request, res: Response): Promise<any> {
        try {
            const id = req.query.mentorId
            const response = await this.adminServices.blockMentor(String(id))
            if (response) {
                return res
                    .status(200)
                    .send({
                        mentor: response,
                        message: `${response.username} Mentor Blocked`,
                        success: true
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }


    async unBlockMentor(req: Request, res: Response): Promise<any> {
        try {
            const id = req.query.mentorId
            const response = await this.adminServices.unBlockMentor(String(id))
            if (response) {
                return res
                    .status(200)
                    .send({
                        mentor: response,
                        message: `${response.username} Mentor UnBlocked`,
                        success: true
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }



    async blockUser(req: Request, res: Response): Promise<any> {
        try {
            const id = req.query.userId
            const response = await this.adminServices.blockUser(String(id))
            if (response) {
                return res
                    .status(200)
                    .send({
                        mentor: response,
                        message: `${response.username} User Blocked`,
                        success: true
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }

    
    async unBlockUser(req: Request, res: Response): Promise<any> {
        try {
            const id = req.query.userId
            const response = await this.adminServices.unBlockUser(String(id))
            if (response) {
                return res
                    .status(200)
                    .send({
                        mentor: response,
                        message: `${response.username} User UnBlocked`,
                        success: true
                    })
            }
        } catch (error) {
            console.log(error)
        }
    }


    /*-------------------------------------- WEEK - 2 ---------------------------------*/
    async addCategory(req: Request, res: Response): Promise<any>{
        try{
            const { categoryName } = req.body
            const data = categoryName
            const response = await  this.adminServices.addCategory(data)

            if(response){
                return res
                .status(200)
                .send({
                    message: 'Category Added',
                    status: true,
                    data: response
                })
            }

        }catch(error: any){
            // console.log(error)
            if(error.name === 'categoryAlreadyExist'){
                return res
                .status(403)
                .send({
                    message: 'Category Already Exist',
                    success: false
                })
            }
        }
    }

    async editCategory(req: Request, res: Response): Promise<any> {
        try {
            const { categoryId } = req.query
            const { categoryName } = req.body
            console.log('cat id: ', categoryId)
            console.log('cat name: ', categoryName)
            const response = await this.adminServices.editCategory(categoryName, String(categoryId))

            if(response === 'Already Exist'){
                return res
                .status(403)
                .send({
                    message: 'Category Already Exist',
                    status: false,
                })
            }

            if(response){
                return res
                .status(200)
                .send({
                    message: 'Category Edited',
                    status: true,
                    data: response
                })
            }

        } catch (error) {
            console.log(error)
        }
    }


    async getAllCategory(req: Request, res: Response): Promise<any> {
        try {
            const response = await this.adminServices.getAllCategory()
            return res
            .status(200)
            .send({
                message: 'All Categories were Got it',
                success: true,
                data: response
            })
        } catch (error) {
            console.log(error)
        }
    }
}