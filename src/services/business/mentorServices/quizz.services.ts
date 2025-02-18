import { MentorAddQuizInput, mentorWalletOutput } from "../../../interface/mentors/mentor.types";
import { IQuiz } from "../../../models/quizz.model";
import MentorQuizzRepository from "../../../repositories/entities/mentorRepositories/quizz.repository";


export default class MentorQuizzServices {
    private mentorQuizzRepository: MentorQuizzRepository

    constructor(mentorQuizzRepository: MentorQuizzRepository) {
        this.mentorQuizzRepository = mentorQuizzRepository;
    }

    
        async mentorAddQuizz(data: MentorAddQuizInput, courseId: string): Promise<IQuiz | null>{
            try{
                const addQuizz = await this.mentorQuizzRepository.mentorAddQuizz(data, courseId)
                return addQuizz
            }catch(error: unknown){
                throw error
            }
        }
    
        async mentorGetAllQuizz(courseId: string, mentorId: string): Promise<IQuiz[] | null> {
            try{
                const getAllQuizz = await this.mentorQuizzRepository.mentorGetAllQuizz(courseId, mentorId)
                return getAllQuizz
            }catch(error: unknown){
                throw error
            }
        }
    
        async mentorDeleteQuizz(courseId: string, quizId: string): Promise<IQuiz | null> {
            try{
                const deleteQuiz = await this.mentorQuizzRepository.mentorDeleteQuizz(courseId, quizId)
                return deleteQuiz
            }catch(error: unknown){
                throw error
            }
        }
    
        async mentorGetWallet(userId: string, page: number, limit: number): Promise<mentorWalletOutput | null>{
            try{
                const getWallet = await this.mentorQuizzRepository.mentorGetWallet(userId, page, limit)
                return getWallet
            }catch(error: unknown){
                throw error
            }
        }
    

}

const mentorQuizzRepository = new MentorQuizzRepository()
export const mentorQuizzServices = new MentorQuizzServices(mentorQuizzRepository)
