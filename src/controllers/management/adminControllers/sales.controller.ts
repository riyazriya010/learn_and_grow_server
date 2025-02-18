import AdminSalesServices, { adminSalesServices } from "../../../services/business/adminServices/sales.services"
import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";


export default class AdminSalesController {
    private adminSalesServices: AdminSalesServices

    constructor(adminSalesServices: AdminSalesServices) {
        this.adminSalesServices = adminSalesServices
    }

    async adminDashboard(req: Request, res: Response): Promise<any> {
        try {
            const getDashboard = await this.adminSalesServices.adminDashboard()

            SuccessResponse(res, 200, 'Dashboard Details Got It', getDashboard)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }


    async adminChartGraph(req: Request, res: Response): Promise<any> {
        try {
            const filters = req.query.filter ? JSON.parse(req.query.filter as string) : {};

            const getChart = await this.adminSalesServices.adminChartGraph(filters)

            SuccessResponse(res, 200, 'Chart Graph Details Got It', getChart)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async adminSalesReport(req: Request, res: Response): Promise<any> {
        try {
            const filters = req.query.filter ? JSON.parse(req.query.filter as string) : {};

            const getReport = await this.adminSalesServices.adminSalesReport(filters)

            SuccessResponse(res, 200, 'Report Details Got It', getReport)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

}

export const adminSalesController = new AdminSalesController(adminSalesServices)
