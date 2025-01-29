import { IMentorMethods } from "../../interface/mentors/mentor.interface";
import { MentorAddChapterInput, MentorAddQuizInput, MentorChatGetRoomsOutput, MentorEditChapterInput, MentorEditCourseInput, mentorFilterCourse, mentorGetALlCourseOuput, MentorProfileUpdateInput, MentorSignUpInput, mentorWalletOutput } from "../../interface/mentors/mentor.types";
import { IMentor } from "../../models/mentor.model";
import { generateAccessToken, verifyToken } from "../../integration/mailToken";
import Mail from "../../integration/nodemailer";
import bcrypt from "bcrypt";
import { IChatRooms } from "../../models/chatRooms.model";
import { IMessages } from "../../models/messages.model";
import { ICourse } from "../../models/uploadCourse.model";
import { number } from "joi";
import { ICategory } from "../../models/categroy.model";
import { IChapter } from "../../models/chapter.model";
import { IQuiz } from "../../models/quizz.model";
import { IMentorWallet } from "../../models/mentorWallet.model";

export default class MentorServices {
    private mentorRepository: IMentorMethods

    constructor(mentorMethods: IMentorMethods) {
        this.mentorRepository = mentorMethods
    }

    async mentorLogin(email: string, password: string): Promise<IMentor | null> {
        try {
            const logUser = await this.mentorRepository.mentorLogin(email, password)

            if (!logUser) {
                const error = new Error('Email Not Found')
                error.name = 'EmailNotFound'
                throw error
            }

            const isPassword = await bcrypt.compare(password, logUser.password)
            if (!isPassword) {
                const error = new Error('Password Invalid')
                error.name = 'PasswordInvalid'
                throw error
            }

            if (logUser.isBlocked) {
                const error = new Error('Mentor Blocked')
                error.name = 'MentorBlocked'
                throw error
            }

            return logUser

        } catch (error: unknown) {
            throw error
        }
    }

    async mentorSignUp(data: MentorSignUpInput): Promise<IMentor | null> {
        try {
            const hashPassword = await bcrypt.hash(data.password, 10)
            data.password = hashPassword
            const addedMentor = await this.mentorRepository.mentorSignUp(data)

            const token = await generateAccessToken({ id: String(addedMentor?._id), email: String(addedMentor?.email) })
            const portLink = process.env.STUDENT_PORT_LINK
            const createdLink = `${portLink}?token=${token}`
            const mail = new Mail()
            mail.sendVerificationEmail(String(addedMentor?.email), createdLink)
                .then(info => {
                    console.log('Verification email sent successfully:');
                })
                .catch(error => {
                    console.error('Failed to send verification email:', error);
                });
            return addedMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGoogleSignUp(email: string, displayName: string): Promise<IMentor | null> {
        try {
            const addedMentor = await this.mentorRepository.mentorGoogleSignUp(email, displayName)
            return addedMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGoogleLogin(email: string): Promise<IMentor | null> {
        try {
            const logMentor = await this.mentorRepository.mentorGoogleLogin(email)

            if (!logMentor) {
                const error = new Error('Email Not Found')
                error.name = 'EmailNotFound'
                throw error
            }

            if (logMentor.isBlocked) {
                const error = new Error('Mentor Blocked')
                error.name = 'MentorBlocked'
                throw error
            }

            return logMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorForgetPassword(email: string, password: string): Promise<IMentor | null> {
        try {
            const hashPassword = await bcrypt.hash(password, 10)
            password = hashPassword
            const updatedMentor = await this.mentorRepository.mentorForgetPassword(email, password)
            return updatedMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorProfileUpdate(userId: string, data: MentorProfileUpdateInput): Promise<IMentor | null> {
        try {
            const updatedProfile = await this.mentorRepository.mentorProfileUpdate(userId, data)
            return updatedProfile
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorCheck(userId: string): Promise<IMentor | null> {
        try {
            const checkMentor = await this.mentorRepository.mentorCheck(userId)
            return checkMentor
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorVerify(email: string): Promise<IMentor | null> {
        try {
            const verifyUser = await this.mentorRepository.mentorVerify(email)
            return verifyUser
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorReVerify(email: string): Promise<IMentor | null> {
        try {
            const verifiedUser = await this.mentorRepository.mentorReVerify(email)
            return verifiedUser
        } catch (error: unknown) {
            throw error
        }
    }


    ///////////////////////////////////// WEEK - 2 ///////////////////////////////

    async mentorAddCourse(data: any): Promise<ICourse | null> {
        try {
            const addCourse = await this.mentorRepository.mentorAddCourse(data)
            return addCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetAllCourse(userId: string, page: number, limit: number): Promise<mentorGetALlCourseOuput | null> {
        try {
            const getAllCourses = await this.mentorRepository.mentorGetAllCourse(userId, page, limit)
            return getAllCourses
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetCourse(courseId: string): Promise<ICourse | null> {
        try {
            const getCourse = await this.mentorRepository.mentorGetCourse(courseId)
            return getCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorEditCourse(courseId: string, updatedFields: MentorEditCourseInput): Promise<ICourse | null> {
        try {
            const editCourse = await this.mentorRepository.mentorEditCourse(courseId, updatedFields)
            return editCourse
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorUnPulishCourse(courseId: string): Promise<ICourse | null> {
        try{
            const unPublish = await this.mentorRepository.mentorUnPulishCourse(courseId)
            return unPublish
        }catch(error: unknown){
            throw error
        }
    }

    async mentorPublishCourse(courseId: string): Promise<ICourse | null> {
        try{
            const publish = await this.mentorRepository.mentorPublishCourse(courseId)
            return publish
        }catch(error: unknown){
            throw error
        }
    }

    async mentorFilterCourse(page: number, limit: number, searchTerm: string): Promise<mentorFilterCourse | null>{
        try{
            const filterCourse = await this.mentorRepository.mentorFilterCourse(page, limit, searchTerm)
            return filterCourse
        }catch(error: unknown){
            throw error
        }
    }

    async mentorGetAllCategorise(): Promise<ICategory[] | null> {
        try{
            const getAllCategories =  await this.mentorRepository.mentorGetAllCategorise()
            return getAllCategories
        }catch(error: unknown){
            throw error
        }
    }

    async mentorAddChapter(data: MentorAddChapterInput): Promise<IChapter | null>{
        try{
            const uploadChapter = await this.mentorRepository.mentorAddChapter(data)
            return uploadChapter
        }catch(error: unknown){
            throw error
        }
    }

    async mentorEditChapter(data: MentorEditChapterInput): Promise<IChapter | null>{
        try{
            const editChapter = await this.mentorRepository.mentorEditChapter(data)
            return editChapter
        }catch(error: unknown){
            throw error
        }
    }

    async mentorGetAllChapters(courseId: string): Promise<IChapter[] | null>{
        try{
            const getChapters = await this.mentorRepository.mentorGetAllChapters(courseId)
            return getChapters
        }catch(error: unknown){
            throw error
        }
    }

    async mentorAddQuizz(data: MentorAddQuizInput, courseId: string): Promise<IQuiz | null>{
        try{
            const addQuizz = await this.mentorRepository.mentorAddQuizz(data, courseId)
            return addQuizz
        }catch(error: unknown){
            throw error
        }
    }

    async mentorGetAllQuizz(courseId: string): Promise<IQuiz[] | null> {
        try{
            const getAllQuizz = await this.mentorRepository.mentorGetAllQuizz(courseId)
            return getAllQuizz
        }catch(error: unknown){
            throw error
        }
    }

    async mentorDeleteQuizz(courseId: string, quizId: string): Promise<IQuiz | null> {
        try{
            const deleteQuiz = await this.mentorRepository.mentorDeleteQuizz(courseId, quizId)
            return deleteQuiz
        }catch(error: unknown){
            throw error
        }
    }

    async mentorGetWallet(userId: string, page: number, limit: number): Promise<mentorWalletOutput | null>{
        try{
            const getWallet = await this.mentorRepository.mentorGetWallet(userId, page, limit)
            return getWallet
        }catch(error: unknown){
            throw error
        }
    }







    //////////////////////////////// WEEK - 3 //////////////////////////////////
    async mentorChatGetRooms(mentorId: string): Promise<MentorChatGetRoomsOutput | null> {
        try {
            const getRooms = await this.mentorRepository.mentorChatGetRooms(mentorId)
            return getRooms
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorCreateRoom(studentId: string, mentorId: string): Promise<IChatRooms | null> {
        try {
            const createRoom = await this.mentorRepository.mentorCreateRoom(studentId, mentorId)
            return createRoom
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetMessages(roomId: string): Promise<IMessages[] | null> {
        try {
            const getMessage = await this.mentorRepository.mentorGetMessages(roomId)
            return getMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorSaveMessage(message: string, roomId: string, receiverId: string, senderId: string): Promise<IMessages | null> {
        try {
            const savedMessage = await this.mentorRepository.mentorSaveMessage(message, roomId, receiverId, senderId)
            return savedMessage
        } catch (error: unknown) {
            throw error
        }
    }

}