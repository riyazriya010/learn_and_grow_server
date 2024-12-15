import { CreateUserDTO } from "../interface/userDto";
import User, { IUser } from "../models/user.model";
import BaseRepository from "./base.repository";



export default class UserRepositories {
    private baseRepository: BaseRepository<IUser>

    constructor(){
        this.baseRepository = new BaseRepository<IUser>(User);
    }

    public async findByEmail(email: string): Promise<IUser | null> {
        const user = await this.baseRepository.findOne({ email })
        return user
    }

    public async find(): Promise<IUser[] | null> {
        return await this.baseRepository.findUsers()
    }

    public async createUser(data: CreateUserDTO): Promise<IUser | null> {
        console.log('user repo - createUser: ', data)
        const response = await this.baseRepository.createUser(data)
        return response
    }
}