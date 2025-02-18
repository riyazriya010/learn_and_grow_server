import MentorQuizzServices, { mentorQuizzServices } from "../../../services/business/mentorServices/quizz.services"
import { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";
import getId from "../../../integration/getId";

export default class MentorQuizzController {
    private mentorQuizzServices: MentorQuizzServices

    constructor(mentorQuizzServices: MentorQuizzServices){
        this.mentorQuizzServices = mentorQuizzServices
    }

    async mentorAddQuizz(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query;
            const data = req.body;
            const addQuizz = await this.mentorQuizzServices.mentorAddQuizz(data, String(courseId))
            SuccessResponse(res, 200, "Quiz Added", addQuizz)
            return
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'QuestionAlreadyExist') {
                    ErrorResponse(res, 403, "Quizz Exists")
                    return
                }
            }
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetAllQuizz(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query
            const mentorId = await getId('accessToken', req) as string
            const getAllQuizz = await this.mentorQuizzServices.mentorGetAllQuizz(String(courseId), mentorId)
            SuccessResponse(res, 200, " Get All Quizz", getAllQuizz)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorDeleteQuizz(req: Request, res: Response): Promise<void> {
        try {
            const { courseId, quizId } = req.query
            const deleteQuizz = await this.mentorQuizzServices.mentorDeleteQuizz(String(courseId), String(quizId))
            SuccessResponse(res, 200, "Quiz Deleted", deleteQuizz)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetWallet(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, limit = 4 } = req.query;

            const pageNumber = parseInt(page as string, 10);
            const limitNumber = parseInt(limit as string, 10);

            const userId = await getId('accessToken', req)
            const getWallet = await this.mentorQuizzServices.mentorGetWallet(String(userId), Number(page), Number(limit))
            SuccessResponse(res, 200, "Wallet Got It", getWallet)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }


}


export const mentorQuizzController = new MentorQuizzController(mentorQuizzServices)

