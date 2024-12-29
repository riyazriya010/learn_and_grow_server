import { studentLoginData } from "../interface/userDto"
import { IUser } from "../models/user.model"
import UserRepositories from "../repositories/userRepository"


export default class UserServices {
    private userRepositories: UserRepositories
    constructor(){
        this.userRepositories = new UserRepositories()
    }

    //new

    public async findByEmail(email: string): Promise<IUser | null>{
        const response = await this.userRepositories.findByEmail(email)
        return response
    }
    
    public async studentSignup(data: studentLoginData): Promise<IUser | null | any>{
        const addStudent = await this.userRepositories.studentSignup(data)
        return addStudent
    }

    public async studentGoogleSignIn(email: string, displayName: string): Promise<IUser | null> {
        const addStudent = await this.userRepositories.studentGoogleSignIn(email, displayName)
        return addStudent
    }

    public async studentGoogleLogin(email: string): Promise<IUser | null> {
        const addStudent = await this.userRepositories.studentGoogleLogin(email)
        return addStudent
    }

    public async studentLogin(email: string, password: string): Promise<IUser | null> {
        const loggedUser = await this.userRepositories.studentLogin(email, password)
        return loggedUser
    }

    public async verifyUser(email: string): Promise<IUser | null>{
        const response = await this.userRepositories.verifyUser(email)
        return response
    }

    public async forgetPassword(data: any): Promise<IUser | null | any>{
        const response = await this.userRepositories.forgetPassword(data)
        return response
    }

    public async checkStudent(id: string): Promise<any>{
        const response = await this.userRepositories.checkStudent(id)
        return response
    }

    public async studentReVerify(email: string): Promise<any>{
        const response = await this.userRepositories.studentReVerify(email)
        return response
    }

    public async isUserBlocked(email: string): Promise<boolean> {
        const response  = await this.userRepositories.isUserBlocked(email)
        return response
    }

    public async profileUpdate(id: string, data: any): Promise<any> {
        const response = await this.userRepositories.profileUpdate(id, data)
        return response
    }


    /* ------------------------------ WEEK -2 -------------------------*/
    public async getAllCourses(): Promise<any> {
        const response = await this.userRepositories.getAllCourses()
        return response
    }

    public async getCourse(id: string): Promise<any> {
        const response = await this.userRepositories.getCourse(id)
        return response
    }
}

