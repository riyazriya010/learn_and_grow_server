import getId from "../../../integration/getId";
import StudentRewardServices, { studentRewardServices } from "../../../services/business/studentServices/badge.services";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";
import { Request, Response } from 'express'


export default class StudentRewardController {
    private studentRewardServices: StudentRewardServices

    constructor(studentRewardServices: StudentRewardServices) {
        this.studentRewardServices = studentRewardServices
    }

    async studentRewardConvert(req: Request, res: Response): Promise<any> {
        try {
            const { badgeId } = req.params
            const studentId = await getId('accessToken', req) as string
            const convertBadge = await this.studentRewardServices.studentRewardConvert(badgeId, studentId)
            SuccessResponse(res, 200, 'Badge Converted', convertBadge)
            return
        } catch (error: unknown) {
            console.info('convert Badge ', error)
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async studentWallet(req: Request, res: Response): Promise<any> {
        try {
            const studentId = await getId('accessToken', req) as string
            const { page = 1, limit = 4 } = req.query;
            const getWallet = await this.studentRewardServices.studentWallet(studentId, String(page), String(limit))
            SuccessResponse(res, 200, 'Student Wallet Got It', getWallet)
            return
        } catch (error: unknown) {
            console.info('convert Badge ', error)
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async studentWalletBalance(req: Request, res: Response): Promise<any> {
        try {
            const studentId = await getId('accessToken', req) as string
            const getBalance = await this.studentRewardServices.studentWalletBalance(studentId)
            SuccessResponse(res, 200, 'Student Wallet Balance Got It', getBalance)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async studentwalletBuyCourse(req: Request, res: Response): Promise<any> {
        try{
            const {price, courseId} = req.body
            const studentId = await getId('accessToken', req) as string
            const buyCourse = await this.studentRewardServices.studentwalletBuyCourse(studentId, price, courseId)
            SuccessResponse(res, 200, 'Course Buyed SuccessFully', buyCourse)
            return
        }catch(error: unknown){
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }
}

export const studentRewardController = new StudentRewardController(studentRewardServices)
