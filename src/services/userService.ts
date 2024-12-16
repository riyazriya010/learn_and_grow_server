import { CreateUserDTO, FindUserDTO } from "../interface/userDto"
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

    public async createUser(data: CreateUserDTO,): Promise<IUser | null> {
        const response = await this.userRepositories.createUser(data)
        return response
    }

    public async findUser(data: FindUserDTO): Promise<IUser | null>{
        const response = await this.userRepositories.findUser(data)
        return response
    }

    public async verifyUser(email: string): Promise<IUser | null>{
        const response = await this.userRepositories.verifyUser(email)
        return response
    }
}