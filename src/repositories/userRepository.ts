import { studentLoginData } from "../interface/userDto";
// import User, { IUser } from "../models/user.model";
import BaseRepository from "./baseRepo/userBase.repository";
import UserModel, { IUser } from "../models/user.model";
import Mail from "../integration/nodemailer";
import { generateRandomFourDigitNumber } from "../integration/mailToken";
import { CourseModel, ICourse } from "../models/uploadCourse.model";
import { ChapterModel, IChapter } from "../models/chapter.model";
import { IPurchasedCourse, PurchasedCourseModel } from "../models/purchased.model";



export default class UserRepositories {
    private baseRepository: BaseRepository<IUser>
    private courseBaseRepository: BaseRepository<ICourse>
    private chapterBaseRepository: BaseRepository<IChapter>
    private purchaseBaseRepository: BaseRepository<IPurchasedCourse>

    constructor() {
        this.baseRepository = new BaseRepository<IUser>(UserModel);
        this.courseBaseRepository = new BaseRepository<ICourse>(CourseModel)
        this.chapterBaseRepository = new BaseRepository<IChapter>(ChapterModel)
        this.purchaseBaseRepository = new BaseRepository<IPurchasedCourse>(PurchasedCourseModel)
    }

    // new
    public async findByEmail(email: string): Promise<IUser | null> {
        const response = await this.baseRepository.findByEmail(email)
        return response
    }

    public async studentSignup(data: studentLoginData): Promise<IUser | null | any> {

        const addedUser = await this.baseRepository.signupStudent(data)
        return addedUser
    }

    public async studentGoogleSignIn(email: string, displayName: string): Promise<IUser | null> {
        const addedUser = await this.baseRepository.studentGoogleSignIn(email, displayName)
        return addedUser
    }

    public async studentGoogleLogin(email: string): Promise<IUser | null> {
        const addedUser = await this.baseRepository.studentGoogleLogin(email)
        return addedUser
    }

    public async studentLogin(email: string, password: string): Promise<IUser | null> {
        const loggedUser = await this.baseRepository.studentLogin(email, password)
        return loggedUser
    }

    public async verifyUser(email: string): Promise<IUser | null> {
        const response = await this.baseRepository.verifyUser(email)
        return response
    }

    public async forgetPassword(data: any): Promise<IUser | null | any> {
        const response = await this.baseRepository.forgetPassword(data)
        return response
    }

    public async checkStudent(id: string): Promise<any> {
        const response = await this.baseRepository.checkStudent(id)
        return response
    }


    public async studentReVerify(email: string): Promise<any> {
        const response = await this.baseRepository.studentReVerify(email)
        return response
    }

    public async isUserBlocked(email: string): Promise<boolean> {
        const response = await this.baseRepository.isUserBlocked(email)
        return response
    }

    public async profileUpdate(id: string, data: any): Promise<any> {
        const response = await this.baseRepository.profileUpdate(id, data)
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


    /*------------------------------------ WEEK - 2 ---------------------------------*/

    // public async getAllCourses(): Promise<any> {
    //     try {
    //         const response = await this.courseBaseRepository.getAllCourses()
    //         return response
    //     } catch (error: any) {
    //         throw error
    //     }
    // }

    public async getAllCourses(page: number, limit: number): Promise<any> {
        try {
            // Fetch paginated courses from the base repository
            const response = await this.courseBaseRepository.getAllCourses(page, limit);
            return response;
        } catch (error: any) {
            throw error;
        }
    }

    public async getCourse(id: string): Promise<any> {
        try {
            const response = await this.courseBaseRepository.getCourse(id)
            return response
        } catch (error: any) {
            throw error
        }
    }

    public async getCoursePlay(id: string): Promise<any> {
        try {
            const response = await this.courseBaseRepository.getCoursePlay(id)
            return response
        } catch (error: any) {
            throw error
        }
    }

    public async filterData(page: number, limit: number, selectedCategory: string, selectedLevel: string, searchTerm: string): Promise<any> {
        try{
            // const response = await this.courseBaseRepository.filterData(filters)
            const response = await this.courseBaseRepository.filterData(
                page,
                limit,
                String(selectedCategory),
                String(selectedLevel),
                String(searchTerm)
            )
            return response
        }catch(error: any){
            throw error
        }
    }


    public async findCourseById(courseId: string): Promise<any> {
        try{
            const response = await this.courseBaseRepository.findCourseById(courseId)
            return response
        }catch(error: any){
            throw error
        }
    }


    public async findChaptersById(courseId: string): Promise<any> {
        try{
            const response = await this.chapterBaseRepository.findChaptersById(courseId)
            return response
        }catch(error: any){
            throw error
        }
    }


    public async buyCourse(userId: string, courseId: string, chapters: any, txnid: string): Promise<any> {
        try{
            const response = await this.purchaseBaseRepository.buyCourse(userId, courseId, chapters, txnid)
            return response
        }catch(error:any){
            throw error
        }
    }

}