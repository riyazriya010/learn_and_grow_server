import { ICategory } from "../../models/categroy.model";
import { IChapter } from "../../models/chapter.model";
import { IChatRooms } from "../../models/chatRooms.model";
import { IMentor } from "../../models/mentor.model";
import { IMentorWallet } from "../../models/mentorWallet.model";
import { IMessages } from "../../models/messages.model";
import { IQuiz } from "../../models/quizz.model";
import { ICourse } from "../../models/uploadCourse.model";
import { MentorAddChapterInput, MentorAddQuizInput, MentorChatGetRoomsOutput, MentorEditChapterInput, MentorEditCourseInput, mentorFilterCourse, mentorGetALlCourseOuput, MentorProfileUpdateInput, MentorSignUpInput, mentorWalletOutput } from "./mentor.types";



export interface IMentorAuthMethods {
    mentorLogin(email: string, password: string): Promise<IMentor | null>
    mentorSignUp(userData: MentorSignUpInput): Promise<IMentor | null>
    mentorGoogleSignUp(email: string, displayName: string): Promise<IMentor | null>
    mentorGoogleLogin(email: string): Promise<IMentor | null>
    mentorForgetPassword(email: string, password: string): Promise<IMentor | null>
    mentorProfileUpdate(userId: string, userData: MentorProfileUpdateInput): Promise<IMentor | null>
    mentorCheck(userId: string): Promise<IMentor | null>
    mentorVerify(email: string): Promise<IMentor | null>
    mentorReVerify(email: string): Promise<IMentor | null>
}

export interface IMentorCourseMethods {
    mentorAddCourse(data: any): Promise<ICourse | null>
    mentorGetAllCourse(userId: string, page: number, limit: number): Promise<mentorGetALlCourseOuput | null>
    mentorGetCourse(courseId: string, mentorId: string): Promise<ICourse | null>
    mentorEditCourse(courseId: string, updatingData: MentorEditCourseInput): Promise<ICourse | null>
    mentorUnPulishCourse(courseId: string): Promise<ICourse | null>
    mentorPublishCourse(courseId: string): Promise<ICourse | null>
    mentorFilterCourse(page: number, limit: number, searchTerm: string, mentorId: string): Promise<mentorFilterCourse | null>
    mentorGetAllCategorise(): Promise<ICategory[] | null>
}

export interface IMentorChapterMethods {
    mentorAddChapter(data: MentorAddChapterInput): Promise<IChapter | null>
    mentorEditChapter(data: MentorEditChapterInput): Promise<IChapter | null>
    mentorGetAllChapters(courseId: string, mentorId: string): Promise<IChapter[] | null>
}

export interface IMentorQuizMethods {
    mentorAddQuizz(data: MentorAddQuizInput, courseId: string): Promise<IQuiz | null>
    mentorGetAllQuizz(courseId: string, mentorId: string): Promise<IQuiz[] | null>
    mentorDeleteQuizz(courseId: string, quizzId: string): Promise<IQuiz | null>
    mentorGetWallet(userId: string, page: number, limit: number): Promise<mentorWalletOutput | null>
}

export interface IMentorChatMethods {
    mentorChatGetStudents(mentorId: string): Promise<any>
    mentorCreateRoom(studentId: string, mentorId: string): Promise<IChatRooms | null>
    mentorSaveMessage(studentId: string, mentorId: string, message: string): Promise<IMessages | null>
    mentorGetMessages(studentId: string, mentorId: string): Promise<IMessages[] | null>
    mentorDeleteEveryOne(messageId: string): Promise<IMessages | null>
    mentorDeleteForMe(messageId: string): Promise<IMessages | null>
    mentorResetCount(studentId: string, mentorId: string): Promise<IMessages[] | null>
}

export interface IMentorNotificationMethods {
    mentorCreateNotification(username: string, senderId: string, receiverId: string): Promise<any>
    mentorGetNotifications(mentorId: string): Promise<any>
    mentorGetStudent(studentId: string, mentorId: string): Promise<any>
    mentorGetNotificationsCount(mentorId: string): Promise<any>
    mentorGetNotificationsSeen(): Promise<any>
    mentorDeleteNotifications(senderId: string): Promise<any>
}

export interface IMentorSalesMethods {
    mentorDashboard(mentorId: string): Promise<any>
    mentorChartGraph(mentorId: string, filters: any): Promise<any>
    mentorSalesReport(mentorId: string, filters: any): Promise<any>
}



export interface IMentorMethods {

    /////////////////////// WEEK - 1 ///////////////////////////

    mentorLogin(email: string, password: string): Promise<IMentor | null>
    mentorSignUp(userData: MentorSignUpInput): Promise<IMentor | null>
    mentorGoogleSignUp(email: string, displayName: string): Promise<IMentor | null>
    mentorGoogleLogin(email: string): Promise<IMentor | null>
    mentorForgetPassword(email: string, password: string): Promise<IMentor | null>
    mentorProfileUpdate(userId: string, userData: MentorProfileUpdateInput): Promise<IMentor | null>
    mentorCheck(userId: string): Promise<IMentor | null>
    mentorVerify(email: string): Promise<IMentor | null>
    mentorReVerify(email: string): Promise<IMentor | null>

    // /////////////////////// WEEK - 2 ///////////////////////////

    mentorAddCourse(data: any): Promise<ICourse | null>
    mentorGetAllCourse(userId: string, page: number, limit: number): Promise<mentorGetALlCourseOuput | null>
    mentorGetCourse(courseId: string): Promise<ICourse | null>
    mentorEditCourse(courseId: string, updatingData: MentorEditCourseInput): Promise<ICourse | null>
    mentorUnPulishCourse(courseId: string): Promise<ICourse | null>
    mentorPublishCourse(courseId: string): Promise<ICourse | null>
    mentorFilterCourse(page: number, limit: number, searchTerm: string): Promise<mentorFilterCourse | null>
    mentorGetAllCategorise(): Promise<ICategory[] | null>
    mentorAddChapter(data: MentorAddChapterInput): Promise<IChapter | null>
    mentorEditChapter(data: MentorEditChapterInput): Promise<IChapter | null>
    mentorGetAllChapters(courseId: string): Promise<IChapter[] | null>
    mentorAddQuizz(data: MentorAddQuizInput, courseId: string): Promise<IQuiz | null>
    mentorGetAllQuizz(courseId: string): Promise<IQuiz[] | null>
    mentorDeleteQuizz(courseId: string, quizzId: string): Promise<IQuiz | null>
    mentorGetWallet(userId: string, page: number, limit: number): Promise<mentorWalletOutput | null>

    /////////////////////////////////////// WEEK - 3 ///////////////////////////////////////


    mentorChatGetStudents(mentorId: string): Promise<any>
    mentorCreateRoom(studentId: string, mentorId: string): Promise<IChatRooms | null>
    mentorSaveMessage(studentId: string, mentorId: string, message: string): Promise<IMessages | null>
    mentorGetMessages(studentId: string, mentorId: string): Promise<IMessages[] | null>
    mentorDeleteEveryOne(messageId: string): Promise<IMessages | null>
    mentorDeleteForMe(messageId: string): Promise<IMessages | null>
    mentorResetCount(studentId: string, mentorId: string): Promise<IMessages[] | null>

    // Notifications
    mentorCreateNotification(username: string, senderId: string, receiverId: string): Promise<any>
    mentorGetNotifications(mentorId: string): Promise<any>
    mentorGetStudent(studentId: string, mentorId: string): Promise<any>
    mentorGetNotificationsCount(mentorId: string): Promise<any>
    mentorGetNotificationsSeen(): Promise<any>
    mentorDeleteNotifications(senderId: string): Promise<any>

    //////////////////////////////////// WEEK - 4 ////////////////////////
    mentorDashboard(mentorId: string): Promise<any>
    mentorChartGraph(mentorId: string, filters: any): Promise<any>
    mentorSalesReport(mentorId: string, filters: any): Promise<any>

}