import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";
import AdminMentorServices, { adminMentorServices } from "../../../services/business/adminServices/mentor.services";

export default class AdminMentorController {
    private adminMentorServices: AdminMentorServices

    constructor(adminMentorServices: AdminMentorServices) {
        this.adminMentorServices = adminMentorServices
    }

    async adminGetMentors(req: Request, res: Response): Promise<void> {
        try {


            const { page = 1, limit = 4 } = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                const error = new Error('Invalid Page Or Limit')
                error.name = 'InvalidPageOrLimit'
                throw error
            }

            const response = await this.adminMentorServices.adminGetMentors(
                pageNumber,
                limitNumber,
            )

            SuccessResponse(res, 200, "Mentors Got It Successfully", response)
            return

        } catch (error: unknown) {
            console.log(error)
            if (error instanceof Error) {
                if (error.name === 'InvalidPageOrLimit') {
                    ErrorResponse(res, 401, 'InvalidPageOrLimit')
                    return
                }

                if (error.name === 'MentorsNotFound') {
                    ErrorResponse(res, 404, 'Mentor Not Found')
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async adminBlockMentor(req: Request, res: Response): Promise<void> {
        try {
            const id = req.query.mentorId
            const response = await this.adminMentorServices.adminBlockMentor(String(id))
            if (response) {
                SuccessResponse(res, 200, "Mentor Blocked Successfully", response)
                return
            }
        } catch (error: unknown) {
            console.log('Mentor Block: ', error)
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }


    async adminUnBlockMentor(req: Request, res: Response): Promise<void> {
        try {
            const id = req.query.mentorId
            const response = await this.adminMentorServices.adminUnBlockMentor(String(id))
            if (response) {
                SuccessResponse(res, 200, "Mentor UnBlocked Successfully", response)
                return
            }
        } catch (error: unknown) {
            console.log('Mentor UnBlock: ', error)
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

}

export const adminMentorController = new AdminMentorController(adminMentorServices)

