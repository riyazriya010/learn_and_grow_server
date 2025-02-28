import mongoose from "mongoose";
import MentorChapterServices, { mentorChapterServices } from "../../../services/business/mentorServices/chapter.services";
import { ErrorResponse, SuccessResponse } from "../../../utils/responseUtil";
import { Request, Response } from "express";
import getId from "../../../integration/getId";

export default class MentorChapterController {
    private mentorChapterServices: MentorChapterServices

    constructor(mentorChapterServices: MentorChapterServices) {
        this.mentorChapterServices = mentorChapterServices
    }

    async mentorAddChapter(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query; // Extract courseId from the query
            // const { title, description, videoUrl } = req.body;
            const { chapterTitle, description, videoUrl } = req.body;
            // const file = req.file as any;
            const data: any = {
                chapterTitle,
                courseId: new mongoose.Types.ObjectId(String(courseId)),
                description,
                videoUrl
                // videoUrl: file.location,
            }
            const uploadChapter = await this.mentorChapterServices.mentorAddChapter(data)
            SuccessResponse(res, 200, "Chapter Uploaded", uploadChapter)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorEditChapter(req: Request, res: Response): Promise<void> {
        try {
            const { chapterId } = req.query;
            // const { title, description } = req.body;
            const { chapterTitle, description, videoUrl } = req.body;

            const file = req.file as any;
            const fileLocation = file?.location

            const data: any = {
                chapterTitle,
                description,
                chapterId: String(chapterId),
                videoUrl
            }
            const editChapter = await this.mentorChapterServices.mentorEditChapter(data)
            SuccessResponse(res, 200, "Chapter Edited", editChapter)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

    async mentorGetAllChapters(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.query
            const mentorId = await getId('accessToken', req) as string
            const getAllChapters = await this.mentorChapterServices.mentorGetAllChapters(String(courseId), mentorId)
            SuccessResponse(res, 200, "Chapters Got It", getAllChapters)
            return
        } catch (error: unknown) {
            ErrorResponse(res, 500, 'Internal Server Error')
            return
        }
    }

}

export const mentorChapterController = new MentorChapterController(mentorChapterServices)
