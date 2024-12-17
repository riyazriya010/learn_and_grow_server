import { studentLoginData } from "../interface/userDto";
// import User, { IUser } from "../models/user.model";
import BaseRepository from "./baseRepo/userBase.repository";
import UserModel, { IUser } from "../models/user.model";



export default class UserRepositories {
    private baseRepository: BaseRepository<IUser>

    constructor(){
        this.baseRepository = new BaseRepository<IUser>(UserModel);
    }

    public async find(): Promise<IUser[] | null> {
        return await this.baseRepository.findUsers()
    }

    public async createUser(data: studentLoginData): Promise<IUser | null> {
        const response = await this.baseRepository.createUser(data)
        return response
    }

    public async findByEmail(email: string): Promise<IUser | null> {
        const response = await this.baseRepository.findByEmail(email)
        return response
    }

    public async verifyUser(email: string): Promise<IUser | null>{
        const response = await this.baseRepository.verifyUser(email)
        return response
    }

    public async googleUser(email: string, displayName: string): Promise<IUser| null>{
        const response = await this.baseRepository.googleUser(email, displayName)
        return response
    }

    // new
    public async studentSignup(data: studentLoginData): Promise<IUser | null> {
        const addedUser = await this.baseRepository.signupStudent(data)
        return addedUser
    }

    public async studentGoogleSignIn(email:string, displayName: string): Promise<IUser | null> {
        const addedUser = await this.baseRepository.studentGoogleSignIn(email, displayName)
        return addedUser
    }

    public async studentLogin(email: string, password: string): Promise<IUser | null> {
        const loggedUser = await this.baseRepository.studentLogin(email, password)
        return loggedUser
    }
}