import { Model, Document } from "mongoose";
import { IUser } from "../../../models/user.model";
import { StudentSignUpInput } from "../../../interface/students/student.types";

export default class StudentAuthBaseRepository<T extends Document> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async findByEmail(email: string): Promise<IUser | null> {
        try {
            return this.model.findOne({ email })
        } catch (error: unknown) {
            throw error
        }
    }

    async findById(id: string): Promise<IUser | null> {
        try {
            return this.model.findById(id)
        } catch (error: unknown) {
            throw error
        }
    }

    async createStudent(data: StudentSignUpInput): Promise<IUser | null> {
        try {
            const user = await this.model.create(data);
            return user.toObject() as unknown as IUser;
        } catch (error: unknown) {
            throw error
        }
    }

    async findByIdAndUpdate(id: string, data: any): Promise<IUser | null> {
        try {
            const updateUser = await this.model.findByIdAndUpdate(
                id,
                data,
                { new: true }
            )
            return updateUser?.toObject() as unknown as IUser;
        } catch (error: unknown) {
            throw error
        }
    }
    
}