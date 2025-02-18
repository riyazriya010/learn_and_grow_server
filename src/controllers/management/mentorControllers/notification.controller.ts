import getId from "../../../integration/getId";
import { mentorNotificationServices } from "../../../services/business/mentorServices/notification.services";
import MentorNotificationServices from "../../../services/business/mentorServices/notification.services";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";
import { Request, Response } from "express";

export default class MentorNotificationController {
    private mentorNotificaitonService: MentorNotificationServices

    constructor(mentorNotificaitonService: MentorNotificationServices){
        this.mentorNotificaitonService = mentorNotificaitonService
    }

    async mentorCreateNotification(req: Request, res: Response): Promise<void> {
        try {
            const { username, senderId, receiverId } = req.body
            const createNotify = await this.mentorNotificaitonService.mentorCreateNotification(String(username), String(senderId), String(receiverId))
            SuccessResponse(res, 200, "notification created", createNotify)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetNotificationsCount(req: Request, res: Response): Promise<void> {
        try {
            const { mentorId } = req.params
            const getCount = await this.mentorNotificaitonService.mentorGetNotificationsCount(String(mentorId))
            SuccessResponse(res, 200, "count get it", getCount)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetNotifications(req: Request, res: Response): Promise<void> {
        try {
            const { mentorId } = req.params
            const getNotify = await this.mentorNotificaitonService.mentorGetNotifications(String(mentorId))
            SuccessResponse(res, 200, "get Notificaton", getNotify)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetNotificationsSeen(req: Request, res: Response): Promise<void> {
        try {
            const notifySeen = await this.mentorNotificaitonService.mentorGetNotificationsSeen()
            SuccessResponse(res, 200, "Notificaton seen", notifySeen)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorDeleteNotifications(req: Request, res: Response): Promise<void> {
        try {
            const { senderId } = req.params
            const deleteNotify = await this.mentorNotificaitonService.mentorDeleteNotifications(String(senderId))
            SuccessResponse(res, 200, "Notificaton deleted", deleteNotify)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetStudent(req: Request, res: Response): Promise<void> {
        try {
            const { studentId } = req.params;
            const mentorId = await getId("accessToken", req) as string
            const getStudent = await this.mentorNotificaitonService.mentorGetStudent(String(studentId), mentorId)
            SuccessResponse(res, 200, "Student get it", getStudent)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

}

export const mentorNotificationController = new MentorNotificationController(mentorNotificationServices)
