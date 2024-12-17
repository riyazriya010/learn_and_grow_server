import { Model, Document, FilterQuery } from "mongoose";
import { IUser } from "../../models/user.model";
import { studentLoginData } from "../../interface/userDto";
import Mail from "../../integration/nodemailer";
import { generateAccessToken } from "../../integration/mailToken";
import bcrypt from 'bcrypt'

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
        const { username, email, phone, password } = userData as Partial<studentLoginData>

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
        const token = await generateAccessToken({ id: savedUser.id, email: email })
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


    async findByEmail(email: string): Promise<T | null> {
        return this.model.findOne({ email })
    }


    async verifyUser(email: string): Promise<IUser | null> {

        const findUser = await this.model.findOne({ email: email }).exec()

        if (!findUser) {
            console.error('User not found:', email); // Debug log
            return null;
        }

        console.log('Found user before update:', findUser); // Debug log

        const user = findUser as unknown as IUser;

        // Update the user verification status
        user.isVerified = true;

        // Save the updated document
        const updatedUser = await user.save();
        console.log('Updated user after verification:', updatedUser)

        return updatedUser;
    }


    async googleUser(email: string, displayName: string): Promise<IUser | null> {


        const userData = {
            username: displayName,
            email: email,
            phone: 'Not Provided',
            role: "user",
            studiedHours: 0,
            isVerified: true
        }

        const document = new this.model(userData)
        const savedUser = await document.save()

        return savedUser as unknown as IUser
    }


    //new
    async signupStudent(data: studentLoginData): Promise<IUser | null> {
        const { username, email, phone, password } = data

        const modifiedUser = {
            username,
            email,
            phone,
            password,
            role: 'user',
            studiedHours: 0,
        }

        const document = new this.model(modifiedUser)
        const savedUser = await document.save()

        const mail = new Mail()
        const token = await generateAccessToken({ id: savedUser.id, email: email })
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

        return savedUser as unknown as IUser

    }

    async studentGoogleSignIn(email: string, displayName: string): Promise<IUser | null> {
        const userData = {
            username: displayName,
            email,
            phone: 'Not Provided',
            studiedHours: 0,
            isVerified: true
        }

        const document = new this.model(userData)
        const savedUser = await document.save()

        return savedUser as unknown as IUser
    }

    async studentLogin(email: string, password: string): Promise<IUser | null> {

        const getUser = await this.model.findOne({ email: email }).lean<IUser>().exec();

        if (!getUser) {
            console.log('not get: ', getUser)
            return null
        }
        console.log('get: ', getUser)
        const isPassword = await bcrypt.compare(password, getUser.password)

        if (!isPassword) {
            console.log('is not pass')
            return null
        }
        console.log('is Pass')
        return getUser
    }

}

