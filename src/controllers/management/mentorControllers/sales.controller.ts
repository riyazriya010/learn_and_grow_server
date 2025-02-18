import getId from "../../../integration/getId"
import MentorSalesServices, { mentorSalesServices } from "../../../services/business/mentorServices/sales.services"
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil"
import { Request, Response } from "express";

export default class MentorSalesController {
    private mentorSalesServices: MentorSalesServices

    constructor(mentorSalesServices: MentorSalesServices){
        this.mentorSalesServices = mentorSalesServices
    }

    async mentorDashboard(req: Request, res: Response): Promise<void> {
        try{
            const mentorId = await getId('accessToken',req) as string
            const getDashboard = await this.mentorSalesServices.mentorDashboard(mentorId)
            SuccessResponse(res, 200, "Dashborad data got it", getDashboard)
            return
        }catch(error: unknown){
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorChartGraph(req: Request, res: Response): Promise<void> {
        try{
            const filters = req.query.filter ? JSON.parse(req.query.filter as string) : {};
            const mentorId = await getId('accessToken',req) as string
            const getChart = await this.mentorSalesServices.mentorChartGraph(mentorId, filters)
            SuccessResponse(res, 200, "Graph Chart data got it", getChart)
            return
        }catch(error: unknown){
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorSalesReport(req: Request, res: Response): Promise<void> {
        try{
            const filters = req.query.filter ? JSON.parse(req.query.filter as string) : {};
            const mentorId = await getId('accessToken',req) as string
            const getChart = await this.mentorSalesServices.mentorSalesReport(mentorId, filters)
            SuccessResponse(res, 200, "Sales Report got it", getChart)
            return
        }catch(error: unknown){
            console.info('mentor report: ',error)
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

}

export const mentorSalesController = new MentorSalesController(mentorSalesServices)
