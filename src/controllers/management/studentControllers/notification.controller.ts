import StudentNotificationServices, { notificationServices } from "../../../services/business/studentServices/notification.services"
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";
import { Request, Response } from 'express'
import getId from "../../../integration/getId";


export default class StudentNotificationController {
    private studentNotificationServices: StudentNotificationServices

    constructor(studentNotificationServices: StudentNotificationServices) {
        this.studentNotificationServices = studentNotificationServices
    }

    async studentCreateNotification(req: Request, res: Response): Promise<void> {
        try {
            console.log('noti ', req.body)
            const { username, senderId, receiverId } = req.body
            const createNotify = await this.studentNotificationServices.studentCreateNotification(String(username), String(senderId), String(receiverId))
            SuccessResponse(res, 200, "notification created", createNotify)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetNotifications(req: Request, res: Response): Promise<void> {
        try {
            const { studentId } = req.params
            const getNotification = await this.studentNotificationServices.studentGetNotifications(String(studentId))
            SuccessResponse(res, 200, "notification got it", getNotification)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetNotificationsCount(req: Request, res: Response): Promise<void> {
        try {
            const { studentId } = req.params
            const getCount = await this.studentNotificationServices.studentGetNotificationsCount(String(studentId))
            SuccessResponse(res, 200, "count got it", getCount)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetNotificationsSeen(req: Request, res: Response): Promise<void> {
        try {
            const markSeen = await this.studentNotificationServices.studentGetNotificationsSeen()
            SuccessResponse(res, 200, "marked seen", markSeen)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentDeleteNotifications(req: Request, res: Response): Promise<void> {
        try {
            const { senderId } = req.params
            const deleteNotify = await this.studentNotificationServices.studentDeleteNotifications(String(senderId))
            SuccessResponse(res, 200, "notification deleted", deleteNotify)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetMentor(req: Request, res: Response): Promise<void> {
        try {
            const { mentorId } = req.params;
            const studentId = await getId("accessToken", req) as string
            const getMentor = await this.studentNotificationServices.studentGetMentor(studentId, String(mentorId))
            SuccessResponse(res, 200, "mentor got it", getMentor)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetBadges(req: Request, res: Response): Promise<void> {
        try {
            const studentId = await getId('accessToken', req) as string
            const getBadges = await this.studentNotificationServices.studentGetBadges(studentId)
            SuccessResponse(res, 200, "Badges Got It", getBadges)
            return;
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }
    
}

export const studentNotificationController = new StudentNotificationController(notificationServices)
