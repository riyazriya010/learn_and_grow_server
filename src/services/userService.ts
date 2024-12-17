import { studentLoginData } from "../interface/userDto"
import { IUser } from "../models/user.model"
import UserRepositories from "../repositories/userRepository"


export default class UserServices {
    private userRepositories: UserRepositories
    constructor(){
        this.userRepositories = new UserRepositories()
    }

    public async getAllUsers(): Promise<IUser[] | null> {
        return await this.userRepositories.find()
    }

    public async createUser(data: studentLoginData,): Promise<IUser | null> {
        const response = await this.userRepositories.createUser(data)
        return response
    }

    public async findByEmail(email: string): Promise<IUser | null>{
        const response = await this.userRepositories.findByEmail(email)
        return response
    }

    public async verifyUser(email: string): Promise<IUser | null>{
        const response = await this.userRepositories.verifyUser(email)
        return response
    }

    public async googleUser(email: string, displayName: string): Promise<IUser | null>{
        const response = await this.userRepositories.googleUser(email, displayName)
        return response
    }


    //new
    public async studentSignup(data: studentLoginData): Promise<IUser | null>{
        const addStudent = await this.userRepositories.studentSignup(data)
        return addStudent
    }

    public async studentGoogleSignIn(email: string, displayName: string): Promise<IUser | null> {
        const addStudent = await this.userRepositories.studentGoogleSignIn(email, displayName)
        return addStudent
    }

    public async studentLogin(email: string, password: string): Promise<IUser | null> {
        const loggedUser = await this.userRepositories.studentLogin(email, password)
        return loggedUser
    }
}

