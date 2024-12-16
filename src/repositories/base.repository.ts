import { Model, Document, FilterQuery } from "mongoose";
import { IUser } from "../models/user.model";
import { CreateUserDTO, FindUserDTO } from "../interface/userDto";
import Mail from "../integration/nodemailer";
import { generateAccessToken } from "../integration/jwt";

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

    async findUsers(): Promise<IUser[] | null> {
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

    // signup student
    async createUser(userData: Partial<T>): Promise<T> {
        const { username, email, phone, password } = userData as Partial<CreateUserDTO>

        if (!username || !email || !phone || !password) {
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

        //mail sending
        const mail = new Mail()
        const token = await generateAccessToken({id: savedUser.id, email: email})
        const portLink = process.env.PORT_LINK
        if (!portLink) {
            throw new Error('PORT_LINK environment variable is not set');
        }
        const createdLink = `${portLink}?token=${token}`
        mail.sendVerificationEmail(email, createdLink)
            .then(info => {
                console.log('Verification email sent successfully:', info);
            })
            .catch(error => {
                console.error('Failed to send verification email:', error);
            });

        return savedUser
    }

    async deleteById(id: string): Promise<T | null> {
        const deletedUser = await this.model.findByIdAndDelete(id).exec()
        return deletedUser
    }

    async findByEmail(data: FindUserDTO): Promise<IUser | null> {
        const findUser = await this.model.findOne({ email: data.email }).lean<IUser>().exec()

        if (!findUser) return null

        if (findUser.password !== data.password) return null;

        return findUser as unknown as IUser
    }

    async verifyUser(email: string): Promise<IUser | null> {

        const findUser = await this.model.findOne({ email: email }).exec()

        if (!findUser) {
            console.error('User not found:', email); // Debug log
            return null;
        }
    
        console.log('Found user before update:', findUser); // Debug log

        const user = findUser as unknown  as IUser;
    
        // Update the user verification status
        user.isVerified = true;
    
        // Save the updated document
        const updatedUser = await user.save();
        console.log('Updated user after verification:', updatedUser)
    
        return updatedUser;
    }
    
}
