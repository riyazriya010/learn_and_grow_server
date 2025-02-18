import AdminCourseServices, { adminCourseServices } from "../../../services/business/adminServices/course.services";
import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";


export default class AdminCourseController {
    private adminCourseServices: AdminCourseServices

    constructor(adminCourseServices: AdminCourseServices) {
        this.adminCourseServices = adminCourseServices
    }

    async adminGetAllCourse(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 4 } = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                const error = new Error('Invalid Page Or Limit')
                error.name = 'InvalidPageOrLimit'
                throw error
            }

            const response = await this.adminCourseServices.adminGetAllCourse(
                pageNumber,
                limitNumber,
            )

            SuccessResponse(res, 200, "Courses Got It Successfully", response)
            return

        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'InvalidPageOrLimit') {
                    ErrorResponse(res, 401, 'InvalidPageOrLimit')
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }


    async adminUnListCourse(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query
            const response = await this.adminCourseServices.adminUnListCourse(String(courseId))
            SuccessResponse(res, 200, 'Course Unlisted', response)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }


    async adminListCourse(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query
            const response = await this.adminCourseServices.adminListCourse(String(courseId))
            SuccessResponse(res, 200, 'Course Listed', response)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async adminNonApprovedCourse(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 1 } = req.query

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            const getNotApprovedCourse = await this.adminCourseServices.adminNonApprovedCourse(pageNumber, limitNumber)

            SuccessResponse(res, 200, 'Not Approved Course Got It', getNotApprovedCourse)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async adminNonApprovedCourseDetails(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query
            const getDetails = await this.adminCourseServices.adminNonApprovedCourseDetails(String(courseId))
            SuccessResponse(res, 200, 'Course Details Got It', getDetails)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async adminApproveCourse(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query
            const approveIt = await this.adminCourseServices.adminApproveCourse(String(courseId))
            SuccessResponse(res, 200, 'Course Approved', approveIt)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }


    async adminGetWallet(req: Request, res: Response): Promise<any> {
        try {
            const { page = 1, limit = 4 } = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            if (pageNumber < 1 || limitNumber < 1) {
                const error = new Error('Invalid page or limit value')
                error.name = 'Invalidpageorlimitvalue'
                throw error
            }

            // const userId = await getId('accessToken', req)
            const adminId = 'admin'

            const response = await this.adminCourseServices.adminGetWallet(adminId, pageNumber, limitNumber)

            SuccessResponse(res, 200, 'Course Approved', response)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

}

export const adminCourseController = new AdminCourseController(adminCourseServices)
