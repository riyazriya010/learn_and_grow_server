import mongoose from "mongoose";
import { IMentorQuizMethods } from "../../../interface/mentors/mentor.interface";
import { MentorAddQuizInput, mentorWalletOutput } from "../../../interface/mentors/mentor.types";
import { IMentorWallet, MentorWalletModel } from "../../../models/mentorWallet.model";
import QuizModel, { IQuiz } from "../../../models/quizz.model";
import { CourseModel, ICourse } from "../../../models/uploadCourse.model";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";



export default class MentorQuizzRepository extends CommonBaseRepository<{
    Quizz: IQuiz;
    MentorWallet: IMentorWallet;
    Course: ICourse;
}> implements IMentorQuizMethods {

    constructor() {
        super({
            Quizz: QuizModel,
            MentorWallet: MentorWalletModel,
            Course: CourseModel
        })
    }

    async mentorAddQuizz(data: MentorAddQuizInput, courseId: string): Promise<IQuiz | null> {
        try {
            const findQuizz = await this.findOne('Quizz', { courseId: courseId }) as IQuiz;

            const questionData = {
                question: data.question,
                options: [data.option1, data.option2],
                correct_answer: data.correctAnswer,
            };

            const questionExist = findQuizz?.questions.some(q => q.question === data.question);
            if (questionExist) {
                const error = new Error('Question Already Exist')
                error.name = 'QuestionAlreadyExist'
                throw error
            }

            if (findQuizz) {
                findQuizz.questions.push(questionData);
                await findQuizz.save();
                return findQuizz;
            }
            const quizData = {
                courseId: new mongoose.Types.ObjectId(courseId),
                questions: [questionData]
            }
            const newQuizz = await this.createData('Quizz', quizData as unknown as Partial<IQuiz>);
            return newQuizz;


        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetAllQuizz(courseId: string, mentorId: string): Promise<IQuiz[] | null> {
        try {
            const findCourse = await this.findOne('Course', { _id: courseId, mentorId })
            if (!findCourse) {
                return []
            }
            const getAllQuizz = await this.findAll('Quizz', { courseId })
            return getAllQuizz
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorDeleteQuizz(courseId: string, quizzId: string): Promise<IQuiz | null> {
        try {
            const findQuizz = await this.findOne('Quizz', { courseId }) as IQuiz;
            const objectIdQuizId = new mongoose.Types.ObjectId(quizzId);

            findQuizz.questions = findQuizz.questions.filter((question: any) =>
                !question._id.equals(objectIdQuizId)
            );

            const updatedQuizz = await findQuizz.save();
            return updatedQuizz;
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetWallet(userId: string, page: number, limit: number): Promise<mentorWalletOutput | null> {
        try {
            const skip = (page - 1) * limit;

            const response = await this.findAll('MentorWallet', { mentorId: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-__v"); // Exclude the `__v` field if unnecessary

            // Count total wallet documents for the mentor
            const totalWallets = await this.findAll('MentorWallet', { mentorId: userId }).countDocuments();

            return {
                wallets: response, // Renamed to `wallets` for better readability
                currentPage: page,
                totalPages: Math.ceil(totalWallets / limit),
                totalWallets,
            };

        } catch (error: unknown) {
            throw error
        }
    }


}