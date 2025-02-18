import StudentChatServices, { chatServices } from "../../../services/business/studentServices/chat.services"
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";
import { Request, Response } from 'express'
import getId from "../../../integration/getId";


export default class StudentChatController {
    private studentChatServices: StudentChatServices

    constructor(studentChatServices: StudentChatServices) {
        this.studentChatServices = studentChatServices
    }

    async studentChatGetMentors(req: Request, res: Response): Promise<void> {
        try {
            const studentId = getId("accessToken", req) as string
            const getMentors = await this.studentChatServices.studentChatGetMentors(studentId)
            SuccessResponse(res, 200, "Mentors Got It", getMentors)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentCreateRoom(req: Request, res: Response): Promise<void> {
        try {
            const { mentorId } = req.body
            const studentId = getId("accessToken", req) as string
            const createdRoom = await this.studentChatServices.studentCreateRoom(studentId, String(mentorId))
            SuccessResponse(res, 200, "Room Created", createdRoom)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentSaveMessage(req: Request, res: Response): Promise<void> {
        try {
            const { message, mentorId } = req.body
            const studentId = getId("accessToken", req) as string
            const savedMessage = await this.studentChatServices.studentSaveMessage(studentId, String(mentorId), String(message))
            SuccessResponse(res, 200, "Message Saved", savedMessage)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentGetMessages(req: Request, res: Response): Promise<void> {
        try {
            const { mentorId } = req.params
            const studentId = getId("accessToken", req) as string
            const getMessage = await this.studentChatServices.studentGetMessages(studentId, String(mentorId))
            SuccessResponse(res, 200, "Message Got It", getMessage)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentDeleteEveryOne(req: Request, res: Response): Promise<void> {
        try {
            const { messageId } = req.params
            const deleteEveryOne = await this.studentChatServices.studentDeleteEveryOne(String(messageId))
            SuccessResponse(res, 200, "Message deleted foreveryone", deleteEveryOne)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentDeleteForMe(req: Request, res: Response): Promise<void> {
        try {
            const { messageId } = req.params
            const deleteForMe = await this.studentChatServices.studentDeleteForMe(String(messageId))
            SuccessResponse(res, 200, "Message deleted me", deleteForMe)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }

    async studentResetCount(req: Request, res: Response): Promise<void> {
        try {
            const { mentorId } = req.params
            const studentId = await getId('accessToken', req) as string
            const resetCount = await this.studentChatServices.studentResetCount(studentId, String(mentorId))
            SuccessResponse(res, 200, "Count Reset", resetCount)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, "Internal Server Error")
            return
        }
    }
    

}

export const studentChatController = new StudentChatController(chatServices)
