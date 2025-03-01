import AdminBadgeServices, { adminBadgeServices } from "../../../services/business/adminServices/badge.services";
import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";

export default class AdminBadgeController {
    private adminBadgeServices: AdminBadgeServices

    constructor(adminBadgeServices: AdminBadgeServices){
        this.adminBadgeServices = adminBadgeServices
    }

    async adminAddBadge(req: Request, res: Response): Promise<any> {
        try {
            const { badgeName, description, value } = req.body
            const data = {
                badgeName,
                description,
                value
            }
            const savedBadge = await this.adminBadgeServices.adminAddBadge(data)
            SuccessResponse(res, 200, 'Badge Saved', savedBadge)
            return
        } catch (error: unknown) {
            console.log('ADD Badge error ::', error)
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }


    async adminGetBadges(req: Request, res: Response): Promise<any> {
        try {
            const { page = 1, limit = 4 } = req.query;
            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            const getBadges = await this.adminBadgeServices.adminGetBadges(pageNumber, limitNumber)

            SuccessResponse(res, 200, 'Badges All Got It', getBadges)
            return

        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }



    async adminEditBadge(req: Request, res: Response): Promise<any> {
        try {
            const { badgeId } = req.params
            const { badgeName, description, value } = req.body

            const editBadge = await this.adminBadgeServices.adminEditBadge(badgeId, { badgeName, description, value } )
            SuccessResponse(res, 200, 'Badge Saved', editBadge)
            return
        }catch (error: unknown) {
            console.log('Edit Badge error ::', error)
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

}

export const adminBadgeController = new AdminBadgeController(adminBadgeServices)

