import { studentLoginData } from "../interface/userDto";
// import User, { IUser } from "../models/user.model";
import BaseRepository from "./baseRepo/userBase.repository";
import UserModel, { IUser } from "../models/user.model";
import OtpModel, { IOtp } from "../models/otp.model";
import Mail from "../integration/nodemailer";
import { generateRandomFourDigitNumber } from "../integration/mailToken";
import { CourseModel, ICourse } from "../models/uploadCourse.model";



export default class UserRepositories {
    private baseRepository: BaseRepository<IUser>
    private courseBaseRepository: BaseRepository<ICourse>

    constructor(){
        this.baseRepository = new BaseRepository<IUser>(UserModel);
        this.courseBaseRepository = new BaseRepository<ICourse>(CourseModel)
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

    public async studentGoogleSignIn(email:string, displayName: string): Promise<IUser | null> {
        const addedUser = await this.baseRepository.studentGoogleSignIn(email, displayName)
        return addedUser
    }

    public async studentGoogleLogin(email:string): Promise<IUser | null> {
        const addedUser = await this.baseRepository.studentGoogleLogin(email)
        return addedUser
    }

    public async studentLogin(email: string, password: string): Promise<IUser | null> {
        const loggedUser = await this.baseRepository.studentLogin(email, password)
        return loggedUser
    }

    public async verifyUser(email: string): Promise<IUser | null>{
        const response = await this.baseRepository.verifyUser(email)
        return response
    }

    public async forgetPassword(data: any): Promise<IUser | null | any>{
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
        const response  = await this.baseRepository.isUserBlocked(email)
        return response
    }

    public async profileUpdate(id: string, data: any): Promise<any> {
        const response = await this.baseRepository.profileUpdate(id, data)
        return response
    }

    public async isBlocked(id: string): Promise<boolean> {
        const response  = await this.baseRepository.isBlocked(id)
        return response
    }

    public async isVerified(id: string): Promise<boolean> {
        const response  = await this.baseRepository.isVerified(id)
        return response
    }


    /*------------------------------------ WEEK - 2 ---------------------------------*/

    public async getAllCourses(): Promise<any> {
        const response = await this.courseBaseRepository.getAllCourses()
        return response
    }

    public async getCourse(id: string): Promise<any> {
        const response = await this.courseBaseRepository.getCourse(id)
        return response
    }

}