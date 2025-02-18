import MentorChatServices, { mentorChatServices } from "../../../services/business/mentorServices/chat.services";
import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";
import getId from "../../../integration/getId";

export default class MentorChatController {
    private mentorChatServices: MentorChatServices

    constructor(mentorChatServices: MentorChatServices) {
        this.mentorChatServices = mentorChatServices
    }

    async mentorChatGetStudents(req: Request, res: Response): Promise<void> {
        try {
            const mentorId = getId("accessToken", req) as string
            const getStudent = await this.mentorChatServices.mentorChatGetStudents(mentorId)
            SuccessResponse(res, 200, "Students Got It", getStudent)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetMessages(req: Request, res: Response): Promise<void> {
        try {
            const { studentId } = req.params
            const mentorId = getId("accessToken", req) as string
            const getMessage = await this.mentorChatServices.mentorGetMessages(String(studentId), mentorId)
            SuccessResponse(res, 200, "Messages Got It", getMessage)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorSaveMessage(req: Request, res: Response): Promise<void> {
        try {
            const { message, studentId } = req.body
            const mentorId = getId("accessToken", req) as string
            const saveMessage = await this.mentorChatServices.mentorSaveMessage(studentId, String(mentorId), String(message))
            SuccessResponse(res, 200, "Message saved", saveMessage)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorCreateRoom(req: Request, res: Response): Promise<void> {
        try {
            const { studentId } = req.body
            const mentorId = getId("accessToken", req) as string
            const createdRoom = await this.mentorChatServices.mentorCreateRoom(String(studentId), mentorId)
            SuccessResponse(res, 200, "Room Created", createdRoom)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorDeleteEveryOne(req: Request, res: Response): Promise<void> {
        try {
            const { messageId } = req.params
            const deleteForEveryOne = await this.mentorChatServices.mentorDeleteEveryOne(String(messageId))
            SuccessResponse(res, 200, "Message Deleted For EveryOne", deleteForEveryOne)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorDeleteForMe(req: Request, res: Response): Promise<void> {
        try {
            const { messageId } = req.params
            const deleteForMe = await this.mentorChatServices.mentorDeleteForMe(String(messageId))
            SuccessResponse(res, 200, "Message Deleted For Me", deleteForMe)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorResetCount(req: Request, res: Response): Promise<void> {
        try {
            const { studentId } = req.params
            const mentorId = await getId('accessToken', req) as string
            const resetCount = await this.mentorChatServices.mentorResetCount(String(studentId), mentorId)
            SuccessResponse(res, 200, "count reset", resetCount)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

}

export const mentorchatController = new MentorChatController(mentorChatServices)

