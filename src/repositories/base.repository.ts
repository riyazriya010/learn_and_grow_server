import { Model, Document, FilterQuery } from "mongoose";
import { IUser } from "../models/user.model";
import { CreateUserDTO } from "../interface/userDto";

export default class BaseRepository<T extends Document> {
    private model: Model<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    async findAll(): Promise<T[]> {
        return this.model.find()
    }

    async findOne(query: FilterQuery<T>): Promise<IUser | null> {
        // Using lean() to return plain JavaScript objects instead of Mongoose Document
        const foundUser = await this.model.findOne(query).lean().exec()
        if (!foundUser) {
            return null
        }
        return foundUser as IUser
    }

    async findUsers(): Promise<IUser [] | null> {
        const users = await this.model.find().exec(); // No .lean() used
    
        if (!users || users.length === 0) {
            return null;
        }
        return users as unknown as IUser[]; // Returns Mongoose documents
    }

    async findByPhone(phone: string): Promise<Boolean> {
        const foundUser = await this.model.findOne({ phone: phone })
        return true
    }

    async createUser(userData: Partial<T>): Promise<T> {
        const { username, email, phone, password } = userData as Partial<CreateUserDTO>

        if(!username || !email || !phone || !password){
            throw new Error("Missing required fields");
        }
        const modifiedData = {
            username,
            email,
            phone,
            password,
            role: "user",
            studiedHours: 0,
        }
        const document = new this.model(modifiedData)
        const savedUser = await document.save()
        return savedUser
    }

    async deleteById(id: string): Promise<T | null> {
        const deletedUser = await this.model.findByIdAndDelete(id).exec()
        return deletedUser
    }
}
