import { IMentorChapterMethods } from "../../../interface/mentors/mentor.interface";
import { MentorAddChapterInput, MentorEditChapterInput } from "../../../interface/mentors/mentor.types";
import { ChapterModel, IChapter } from "../../../models/chapter.model";
import { CourseModel, ICourse } from "../../../models/uploadCourse.model";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";



export default class MentorChapterRepository extends CommonBaseRepository<{
    Chapter: IChapter;
    Course: ICourse;
}> implements IMentorChapterMethods {

    constructor() {
        super({
            Chapter: ChapterModel,
            Course: CourseModel
        })
    }

    async mentorAddChapter(data: MentorAddChapterInput): Promise<IChapter | null> {
        try {
            const newDocument = await this.createData('Chapter', data as unknown as Partial<IChapter>)
            const savedChapter = await newDocument.save()

            await CourseModel.findByIdAndUpdate(
                data.courseId,
                {
                    $push: {
                        fullVideo: { chapterId: savedChapter._id },
                    },
                },
                { new: true }
            );

            return savedChapter

        } catch (error: unknown) {
            throw error
        }
    }

    async mentorEditChapter(data: MentorEditChapterInput): Promise<IChapter | null> {
        try {
            const datas: any = {
                chapterTitle: data.chapterTitle,
                description: data.description,
            }

            if (data.videoUrl) {
                datas.videoUrl = data.videoUrl
            }

            const updatedChapter = await this.updateById('Chapter',
                data.chapterId,
                { $set: datas },
            );

            return updatedChapter

        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetAllChapters(courseId: string, mentorId: string): Promise<IChapter[] | null> {
        try {
            const findCourse = await this.findOne('Course', { _id: courseId, mentorId })
            if (!findCourse) {
                return []
            }
            const getChapters = await this.findAll('Chapter', { courseId })
            return getChapters
        } catch (error: unknown) {
            throw error
        }
    }

}