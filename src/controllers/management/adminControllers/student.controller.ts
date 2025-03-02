import AdminStudentServices, { adminStudentServices } from "../../../services/business/adminServices/student.services";
import { JwtService } from "../../../integration/jwt";
import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";

export default class AdminStudentController {
    private adminStudentServices: AdminStudentServices
    private jwtService: JwtService

    constructor(adminStudentServices: AdminStudentServices) {
        this.adminStudentServices = adminStudentServices
        this.jwtService = new JwtService()
    }

    async adminLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body

            if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
                const error = new Error('Invalid Credentials')
                error.name = 'InvalidCredentials'
                throw error
            }

            const userJwtToken = await this.jwtService.createToken(String(email), 'admin')
            const userRefreshToken = await this.jwtService.createRefreshToken(String(email), 'admin')

            return res
                .status(200)
                .cookie('accessToken', userJwtToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                }).cookie('refreshToken', userRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                })
                .send({
                    success: true,
                    message: 'Admin Found Successfully',
                })

        } catch (error: unknown) {
            console.log('Admin Login Error', error)
            if (error instanceof Error) {
                if (error.name === 'InvalidCredentials') {
                    ErrorResponse(res, 401, "Invalid Credentials")
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async adminGetStudents(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 4 } = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                const error = new Error('Invalid Page Or Limit')
                error.name = 'InvalidPageOrLimit'
                throw error
            }

            const response = await this.adminStudentServices.adminGetStudents(
                pageNumber,
                limitNumber,
            )

            SuccessResponse(res, 200, "Users Got It Successfully", response)
            return
        } catch (error: unknown) {
            console.log(error)
            if (error instanceof Error) {
                if (error.name === 'InvalidPageOrLimit') {
                    ErrorResponse(res, 401, 'InvalidPageOrLimit')
                    return
                }

                if (error.name === 'UsersNotFound') {
                    ErrorResponse(res, 404, 'Users Not Found')
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async adminBlockStudent(req: Request, res: Response): Promise<void> {
        try {
            const id = req.query.userId
            const response = await this.adminStudentServices.adminBlockStudent(String(id))
            if (response) {
                SuccessResponse(res, 200, "User Blocked Successfully", response)
                return
            }
        } catch (error: unknown) {
            console.log('User Block: ', error)
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async adminUnBlockStudent(req: Request, res: Response): Promise<void> {
        try {
            const id = req.query.userId
            const response = await this.adminStudentServices.adminUnBlockStudent(String(id))
            if (response) {
                SuccessResponse(res, 200, "User UnBlocked Successfully", response)
                return
            }
        } catch (error: unknown) {
            console.log('User UnBlock: ', error)
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async adminLogout(req: Request, res: Response): Promise<any> {
        try {

            const accessToken = req.cookies.accessToken;
            const refreshToken = req.cookies.refreshToken;

            const addToken = await this.adminStudentServices.addTokens(accessToken, refreshToken)

            console.log('tokens Added ::: ', addToken)

            return res
                .status(200)
                .clearCookie("accessToken", {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    domain: ".learngrow.live",
                })
                .clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: ".learngrow.live",
                })
                .send({ success: true, message: "Logged out successfully" });

        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }


}

export const adminStudentController = new AdminStudentController(adminStudentServices)

