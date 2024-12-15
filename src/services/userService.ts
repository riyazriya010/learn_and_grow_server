import { CreateUserDTO } from "../interface/userDto"
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

    public async createUser(data: CreateUserDTO): Promise<IUser | null> {
        console.log('user services - createUser: ', data)
        const response = await this.userRepositories.createUser(data)
        return response
    }
}