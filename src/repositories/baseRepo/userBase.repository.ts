import { Model, Document, FilterQuery } from "mongoose";
import { IUser } from "../../models/user.model";
import { studentLoginData } from "../../interface/userDto";
import { generateAccessToken } from "../../integration/mailToken";
import bcrypt from 'bcrypt'
import Mail from "../../integration/nodemailer";

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

    async findByEmail(email: string): Promise<T | null> {
        return this.model.findOne({ email })
    }

    
    async signupStudent(data: studentLoginData): Promise<any> {
        const { username, email, phone, password } = data

        const modifiedUser = {
            username,
            email,
            phone,
            password,
            role: 'student',
            studiedHours: 0,
        }

        const document = new this.model(modifiedUser)
        const savedUser = await document.save()

        const token = await generateAccessToken({ id: savedUser.id, email: email })
        const portLink = process.env.STUDENT_PORT_LINK
        if (!portLink) {
            throw new Error('PORT_LINK environment variable is not set');
        }
        const createdLink = `${portLink}?token=${token}`
        const mail = new Mail()
        mail.sendVerificationEmail(email, createdLink)
            .then(info => {
                console.log('Verification email sent successfully:');
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
            password: 'null',
            role: 'student',
            isVerified: true
        }

        const document = new this.model(userData)
        const savedUser = await document.save()

        return savedUser as unknown as IUser
    }


    async studentGoogleLogin(email: string): Promise<IUser | null> {
        const response = await this.model.findOne({ email: email })
        return response as unknown as IUser
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


    async createOtp(email: string, otp: string): Promise<any> {
        try {
            const data = {
                email,
                otp
            }
            const document = new this.model(data)
            console.log(document)
            const savedOtp = await document.save()
            setTimeout(async () => {
                await this.model.findByIdAndDelete(savedOtp._id)
                console.log('otp deleted ', email)
            }, 60000)
            return savedOtp

        } catch (error) {
            console.log(error)
        }
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


    async forgetPassword(data: any): Promise<any> {
        try {
            const { email, password } = data

            const isUser = await this.model.findOne({ email: email }).exec()

            if (!isUser) {
                return null
            }
            const user = isUser as unknown as IUser

            const hashedPassword = await bcrypt.hash(password, 10)
            user.password = hashedPassword

            console.log('user: ', user)
            const updatedUser = await user.save()
            console.log('user2')
            return updatedUser
        } catch (error) {
            console.log(error)
        }
    }


    async checkStudent(id: string): Promise<any> {
        try {
            const response = await this.model.findById(id)
            const user = response as unknown as IUser
            return user
        } catch (error) {
            console.log(error)
        }
    }

    async studentReVerify(email: string): Promise<any> {
        try{
            const userData = await this.model.findOne({email: email})
            if(!userData){
                return null
            }
            const token = await generateAccessToken({ id: userData.id, email: email })
            const portLink = process.env.STUDENT_PORT_LINK
        if (!portLink) {
            throw new Error('PORT_LINK environment variable is not set');
        }
        const createdLink = `${portLink}?token=${token}`
        const mail = new Mail()
        mail.sendVerificationEmail(email, createdLink)
            .then(info => {
                console.log('Verification email sent successfully:');
            })
            .catch(error => {
                console.error('Failed to send verification email:', error);
            }); 
            return userData as unknown as IUser
        }catch(error){
            console.log(error)
        }
    }


    async isUserBlocked(email: string): Promise<any> {
        try {
            const response = await this.model.findOne({ email: email })
            const user = response as unknown as IUser
            if(user.isBlocked){
                return true
            }
            return false
        } catch (error) {
            console.log(error)
        }
    }

    async profileUpdate(id: string, data: any): Promise<any> {
        try{
            const { username, phone } = data
            const response = await this.model.findByIdAndUpdate(
                id, 
                { username, phone },
                { new: true }
            );
            return response
        }catch(error){
            console.log(error)
        }
    }

    async isBlocked(id: string): Promise<any> {
        try {
            const response = await this.model.findById(id)
            const user = response as unknown as IUser
            if(user.isBlocked){
                return true
            }
            return false
        } catch (error) {
            console.log(error)
        }
    }

    async isVerified(id: string): Promise<any> {
        try {
            const response = await this.model.findById(id)
            const user = response as unknown as IUser
            if(user.isVerified){
                return true
            }
            return false
        } catch (error) {
            console.log(error)
        }
    }



    /* ------------------------------ WEEK - 2 -------------------------*/

    async getAllCourses(): Promise<any> {
        try{
            const response = await this.model.find()
            return response
        }catch(error){
            console.log(error)
        }
    }

    async getCourse(id: string): Promise<any> {
        try{
            const response = await this.model.findById(id)
            return response
        }catch(error: any){
            console.log(error)
        }
    }

}

