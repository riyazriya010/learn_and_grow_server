import { CreateUserDTO, FindUserDTO } from "../interface/userDto";
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
        const response = await this.baseRepository.createUser(data)
        return response
    }

    public async findUser(data: FindUserDTO): Promise<IUser | null> {
        const response = await this.baseRepository.findByEmail(data)
        return response
    }

    public async verifyUser(email: string): Promise<IUser | null>{
        const response = await this.baseRepository.verifyUser(email)
        return response
    }
}