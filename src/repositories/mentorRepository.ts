import { response } from "express";
import { mentorSignUpData } from "../interface/mentor.type";
import { CategoryModel, ICategory } from "../models/categroy.model";
import { ChapterModel, IChapter } from "../models/chapter.model";
import MentorModel, { IMentor } from "../models/mentor.model";
import QuizModel, { IQuiz } from "../models/quizz.model";
import { CourseModel, ICourse } from "../models/uploadCourse.model";
import MentorBaseRepository from "./baseRepo/mentorBase.repository";

export class MentorRepository {
    private baseRepository: MentorBaseRepository<IMentor>
    private courseBaseRepository: MentorBaseRepository<ICourse>
    private chapterBaseRepository: MentorBaseRepository<IChapter>
    private categoryBaseRepository: MentorBaseRepository<ICategory>
    private quizzBaseRepository: MentorBaseRepository<IQuiz>

    constructor() {
        this.baseRepository = new MentorBaseRepository<IMentor>(MentorModel)
        this.courseBaseRepository = new MentorBaseRepository<ICourse>(CourseModel)
        this.chapterBaseRepository = new MentorBaseRepository<IChapter>(ChapterModel)
        this.categoryBaseRepository = new MentorBaseRepository<ICategory>(CategoryModel)
        this.quizzBaseRepository = new MentorBaseRepository<IQuiz>(QuizModel)
    }

    async findByEmail(email: string): Promise<IMentor | null> {
        const response = await this.baseRepository.findByEmail(email)
        return response
    }

    async mentorSignUp(data: mentorSignUpData): Promise<IMentor | null> {
        const response = await this.baseRepository.mentorSignUp(data)
        return response
    }

    async mentorLogin(email: string, password: string): Promise<IMentor | null> {
        const loggedUser = await this.baseRepository.mentorLogin(email, password)
        return loggedUser
    }

    async forgetPassword(data: any): Promise<IMentor | null | any> {
        const response = await this.baseRepository.forgetPassword(data)
        return response
    }


    public async mentorGoogleLogin(email: string): Promise<IMentor | null> {
        const addedUser = await this.baseRepository.mentorGoogleLogin(email)
        return addedUser
    }

    public async mentorGoogleSignUp(email: string, displayName: string): Promise<IMentor | null> {
        const addedUser = await this.baseRepository.mentorGoogleSignUp(email, displayName)
        return addedUser
    }

    public async profileUpdate(id: string, data: any): Promise<any> {
        const response = await this.baseRepository.profileUpdate(id, data)
        return response
    }

    public async checkMentor(id: string): Promise<any> {
        const response = await this.baseRepository.checkStudent(id)
        return response
    }

    public async isUserBlocked(email: string): Promise<boolean> {
        const response = await this.baseRepository.isUserBlocked(email)
        return response
    }

    public async mentorReVerify(email: string): Promise<any> {
        const response = await this.baseRepository.mentorReVerify(email)
        return response
    }

    public async verifyMentor(email: string): Promise<IMentor | null> {
        const response = await this.baseRepository.verifyMentor(email)
        return response
    }

    public async isBlocked(id: string): Promise<boolean> {
        const response = await this.baseRepository.isBlocked(id)
        return response
    }

    public async isVerified(id: string): Promise<boolean> {
        const response = await this.baseRepository.isVerified(id)
        return response
    }


    /* -------------------------- WEEK - 2 ---------------------------------- */

    public async addCourse(data: any): Promise<any> {
        try{
            const response = await this.courseBaseRepository.addCourse(data)
            return response
        }catch(error: any){
            throw error
        }
    }

    public async editCourse(courseId: string, updatedFields: any): Promise<any> {
        try{
            const response = await this.courseBaseRepository.editCourse(courseId, updatedFields)
            return response
        }catch(error: any){
            throw error
        }
    }

    public async unPublishCourse(courseId: string): Promise<any> {
        try{
            const response = await this.courseBaseRepository.unPublishCourse(courseId)
            return response
        }catch(error: any){
            throw error
        }
    }


    public async publishCourse(courseId: string): Promise<any> {
        try{
            const response = await this.courseBaseRepository.publishCourse(courseId)
            return response
        }catch(error: any){
            throw error
        }
    }


    public async filterCourse(page: number, limit: number, searchTerm: string): Promise<any> {
        try {
            const response = await this.courseBaseRepository.filterCourse(
                page,
                limit,
                String(searchTerm)
            )
            return response
        } catch (error: any) {
            throw error
        }
    }


    public async getAllCourses(page: number, limit: number): Promise<boolean> {
        const response = await this.courseBaseRepository.getAllCourses(page, limit)
        return response
    }

    public async getCourse(courseId: string): Promise<any> {
        try{
            const response = await this.courseBaseRepository.getCourse(courseId)
            return response
        }catch(error: any){
            throw error
        }
    }

    async getAllCategory(): Promise<any> {
        try{
            const response = await this.categoryBaseRepository.getAllCategory()
            return response
        }catch(error: any){
            throw error
        }
    }


    public async editChapter(title: string, description: string, chapterId: string, location: string): Promise<any> {
        try{
            const response = await this.chapterBaseRepository.editChapter(title, description, chapterId, location)
            return response
        }catch(error: any){
            throw error
        }
    }


    async getAllChapters(courseId: string): Promise<any> {
        try{
            const response = await this.chapterBaseRepository.getAllChapters(courseId)
            return response
        }catch(error: any){
            throw error
        }
    }

    async addQuizz(data: { question: string; option1: string; option2: string; correctAnswer: string }, courseId: string): Promise<any> {
        try {
            const response = await this.quizzBaseRepository.addQuizz(data, courseId);
            return response;
        } catch (error: any) {
            // console.error('Error in repository layer:', error);
            throw error;
        }
    }

    
    async getAllQuizz(courseId: string): Promise<any> {
        try{
            const response = await this.quizzBaseRepository.getAllQuizz(courseId)
            return response
        }catch(error: any){
            throw error
        }
    }

    
    async deleteQuizz(courseId: string, quizId: string): Promise<any> {
        try{
            const response = await this.quizzBaseRepository.deleteQuizz(courseId, quizId)
            return response
        }catch(error: any){
            throw error
        }
    }

}