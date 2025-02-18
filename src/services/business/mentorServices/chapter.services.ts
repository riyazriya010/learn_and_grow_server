import { MentorAddChapterInput, MentorEditChapterInput } from "../../../interface/mentors/mentor.types";
import { IChapter } from "../../../models/chapter.model";
import MentorChapterRepository from "../../../repositories/entities/mentorRepositories/chapter.repository";



export default class MentorChapterServices {
    private mentorChapterRepository: MentorChapterRepository

    constructor(mentorChapterRepository: MentorChapterRepository) {
        this.mentorChapterRepository = mentorChapterRepository;
    }


    async mentorAddChapter(data: MentorAddChapterInput): Promise<IChapter | null> {
        try {
            const uploadChapter = await this.mentorChapterRepository.mentorAddChapter(data)
            return uploadChapter
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorEditChapter(data: MentorEditChapterInput): Promise<IChapter | null> {
        try {
            const editChapter = await this.mentorChapterRepository.mentorEditChapter(data)
            return editChapter
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetAllChapters(courseId: string, mentorId: string): Promise<IChapter[] | null> {
        try {
            const getChapters = await this.mentorChapterRepository.mentorGetAllChapters(courseId, mentorId)
            return getChapters
        } catch (error: unknown) {
            throw error
        }
    }

}

const mentorChapterRepository = new MentorChapterRepository()
export const mentorChapterServices = new MentorChapterServices(mentorChapterRepository)