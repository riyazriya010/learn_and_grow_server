import { mentorSignUpData } from "../interface/mentor.type"
import { IMentor } from "../models/mentor.model"
import { IQuiz } from "../models/quizz.model"
import { MentorRepository } from "../repositories/mentorRepository"

export class MentorServices {
    private mentorRepository: MentorRepository

    constructor() {
        this.mentorRepository = new MentorRepository()
    }

    public async findByEmail(email: string): Promise<IMentor | null> {
        const response = await this.mentorRepository.findByEmail(email)
        return response
    }

    public async mentorSignUp(data: mentorSignUpData): Promise<IMentor | null> {
        const response = await this.mentorRepository.mentorSignUp(data)
        return response
    }

    public async mentorLogin(email: string, password: string): Promise<IMentor | null> {
        const loggedUser = await this.mentorRepository.mentorLogin(email, password)
        return loggedUser
    }

    public async forgetPassword(data: any): Promise<IMentor | null | any> {
        const response = await this.mentorRepository.forgetPassword(data)
        return response
    }

    public async mentorGoogleLogin(email: string): Promise<IMentor | null> {
        const addStudent = await this.mentorRepository.mentorGoogleLogin(email)
        return addStudent
    }

    public async mentorGoogleSignUp(email: string, displayName: string): Promise<IMentor | null> {
        const addStudent = await this.mentorRepository.mentorGoogleSignUp(email, displayName)
        return addStudent
    }

    public async profileUpdate(id: string, data: any): Promise<any> {
        const response = await this.mentorRepository.profileUpdate(id, data)
        return response
    }

    public async checkMentor(id: string): Promise<any>{
        const response = await this.mentorRepository.checkMentor(id)
        return response
    }

    public async isUserBlocked(email: string): Promise<boolean> {
        const response  = await this.mentorRepository.isUserBlocked(email)
        return response
    }

    public async mentorReVerify(email: string): Promise<any>{
        const response = await this.mentorRepository.mentorReVerify(email)
        return response
    }

     public async verifyMentor(email: string): Promise<IMentor | null>{
            const response = await this.mentorRepository.verifyMentor(email)
            return response
        }


        /*---------------------------------- WEEK - 2 -------------------------------*/

        public async addCourse(data: any): Promise<any> {
            try{
                const response = await this.mentorRepository.addCourse(data)
                return response
            }catch(error: any){
                throw error
            }
        }

        public async editCourse(courseId: string, updatedFields: any): Promise<any> {
            try{
                const response = await this.mentorRepository.editCourse(courseId, updatedFields)
                return response
            }catch(error: any){
                throw error
            }
        }

        public async unPublishCourse(courseId: string): Promise<any> {
            try{
                const response = await this.mentorRepository.unPublishCourse(courseId)
                return response
            }catch(error: any){
                throw error
            }
        }


        public async publishCourse(courseId: string): Promise<any> {
            try{
                const response = await this.mentorRepository.publishCourse(courseId)
                return response
            }catch(error: any){
                throw error
            }
        }


        public async filterCourse(page: number, limit: number, searchTerm: string): Promise<any> {
            try {
                const response = await this.mentorRepository.filterCourse(
                    page,
                    limit,
                    String(searchTerm)
                )
                return response
            } catch (error: any) {
                throw error
            }
        }


        public async getAllCourses(page: number, limit: number, userId: string): Promise<any> {
            const response = await this.mentorRepository.getAllCourses(page, limit, userId)
            return response
        }

        public async getCourse(courseId: string): Promise<any> {
            try{
                const response = await this.mentorRepository.getCourse(courseId)
                return response
            }catch(error: any){
                throw error
            }
        }


        public async editChapter(title: string, description: string, chapterId: string, location: string): Promise<any> {
            try{
                const response = await this.mentorRepository.editChapter(title, description, chapterId, location)
                return response
            }catch(error: any){
                throw error
            }
        }


        public async getAllCategory(): Promise<any> {
            try{
                const response = await this.mentorRepository.getAllCategory()
                return response
            }catch(error: any){
                throw error
            }
        }

        public async getAllChapters(courseId: string): Promise<any> {
            try{
                const response = await this.mentorRepository.getAllChapters(courseId)
                return response
            }catch(error: any){
                throw error
            }
        }


        public async addQuizz(data: { question: string; option1: string; option2: string; correctAnswer: string }, courseId: string): Promise<any> {
            try {
                const response = await this.mentorRepository.addQuizz(data, courseId);
                return response;
            } catch (error: any) {
                // console.error('Error in service layer:', error);
                throw error;
            }
        }


        public async getAllQuizz(courseId: string): Promise<any> {
            try{
                const response = await this.mentorRepository.getAllQuizz(courseId)
                return response
            }catch(error: any){
                throw error
            }
        }

        public async deleteQuizz(courseId: string, quizId: string): Promise<any> {
            try{
                const response = await this.mentorRepository.deleteQuizz(courseId, quizId)
                return response
            }catch(error: any){
                throw error
            }
        }

        public async getWallet(userId: string, pageNumber: number, limitNumber: number): Promise<any> {
            try{
                const response  = await this.mentorRepository.getWallet(userId, pageNumber, limitNumber)
                return response
            }catch(error: any){
                throw error
            }
        }
}