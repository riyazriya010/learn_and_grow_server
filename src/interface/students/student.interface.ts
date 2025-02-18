import { ICertificate } from "../../models/certificate.model";
import { IChatRooms } from "../../models/chatRooms.model";
import { IMessages } from "../../models/messages.model";
import { IPurchasedCourse } from "../../models/purchased.model";
import { IQuiz } from "../../models/quizz.model";
import { IBadge } from "../../models/studentBadges.model";
import { IStudentNotification } from "../../models/studentNotification.model";
import { ICourse } from "../../models/uploadCourse.model";
import { IUser } from "../../models/user.model";
import {
    StudentGoogleSignupInput,
    StudentSignUpInput,
    StudentProfileInput,
    StudentCourseFilterData,
    StudentGetCourseOuput,
    studentGetAllCoursesOuput,
    studentFilterCoursesOuput,
    StudentGetCoursePlayOutput,
    StudentBuyCourseInput,
    studentGetBuyedCourses,
    StudentCoursePlay,
    studentCompleteCourse,
    StudentCreateCreatificateData,
    StudentChatGetUsersOutput
} from "./student.types";

export interface IStudentAuthMethods {
    studentSignUp(userData: StudentSignUpInput): Promise<IUser | null>
    studentLogin(email: string, password: string): Promise<IUser | null>
    studentGoogleSignUp(userData: StudentGoogleSignupInput): Promise<IUser | null>
    studentGoogleLogin(email: string): Promise<IUser | null>
    studentVerify(email: string): Promise<IUser | null>
    studentForgetPassword(email: string, password: string): Promise<IUser | null>
    studentCheck(studentId: string): Promise<IUser | null>
    studentReVerify(email: string): Promise<IUser | null>
    studentProfleUpdate(studentId: string, userData: StudentProfileInput): Promise<IUser | null>
}

export interface IStudentCourseMethods {
    studentGetAllCourses(pageNumber: number, limitNumber: number): Promise<studentGetAllCoursesOuput | null>
    studentGetCourse(courseId: string, userId: string): Promise<StudentGetCourseOuput | null>
    studentCourseFilterData(filterData: StudentCourseFilterData): Promise<studentFilterCoursesOuput | null>

    studentGetCoursePlay(courseId: string, studentId: string): Promise<StudentGetCoursePlayOutput | null>
    studentBuyCourse(purchaseData: StudentBuyCourseInput): Promise<IPurchasedCourse>
    studentBuyedCourses(studentId: string, pageNumber: number, limitNumber: number): Promise<studentGetBuyedCourses | null>
    studentCoursePlay(purchaseId: string, studentId: string): Promise<StudentCoursePlay>
    studentChapterVideoEnd(chapterId: string, studiedTime: string, studentId: string): Promise<IPurchasedCourse>
    studentCompleteCourse(studentId: string, courseId: string): Promise<studentCompleteCourse>
    studentQuizz(courseId: string, studentId: string): Promise<IQuiz>
    studentCheckAlreadyBuyed(courseId: string, studentId: string): Promise<IPurchasedCourse | null>
}

export interface IStudentCertificateMethods {
    studentGeCerfiticate(certificateId: string, studentId: string): Promise<ICertificate>
    studentCreateCertificate(certificateData: StudentCreateCreatificateData): Promise<ICertificate>
    studentGetAllCertificates(studentId: string): Promise<ICertificate[]>
}

export interface IStudentChatMethods {
    studentChatGetMentors(studentId: string): Promise<StudentChatGetUsersOutput | null>
    studentCreateRoom(studentId: string, mentorId: string): Promise<IChatRooms | null>
    studentSaveMessage(studentId: string, mentorId: string, message: string): Promise<IMessages | null>
    studentGetMessages(studentId: string, mentorId: string): Promise<IMessages[] | null>
    studentDeleteEveryOne(messageId: string): Promise<IMessages | null>
    studentDeleteForMe(messageId: string): Promise<IMessages | null>
    studentResetCount(studentId: string, mentorId: string): Promise<IMessages[] | null>
}

export interface IStudentNotificationMethods {
    studentCreateNotification(username: string, senderId: string, receiverId: string): Promise<any>
    studentGetNotifications(studentId: string): Promise<IStudentNotification[] | null>
    studentGetNotificationsCount(studentId: string): Promise<any>
    studentGetNotificationsSeen(): Promise<any>
    studentDeleteNotifications(senderId: string): Promise<any>
    studentGetMentor(studentId: string, mentorId: string): Promise<StudentChatGetUsersOutput | null>

    studentGetBadges(studentId: string): Promise<IBadge[] | null>
}




/// prev main

export interface IStudentMethods {

    //common methods
    // findOne(data: string): Promise<any>
    // findById(id: string): Promise<any>

    //////////////////////// WEEK - 1 ///////////////////////
    studentSignUp(userData: StudentSignUpInput): Promise<IUser | null>
    studentLogin(email: string, password: string): Promise<IUser | null>
    studentGoogleSignUp(userData: StudentGoogleSignupInput): Promise<IUser | null>
    studentGoogleLogin(email: string): Promise<IUser | null>
    studentVerify(email: string): Promise<IUser | null>
    studentForgetPassword(email: string, password: string): Promise<void>
    studentCheck(studentId: string): Promise<IUser | null>
    studentReVerify(email: string): Promise<IUser | null>
    studentProfleUpdate(studentId: string, userData: StudentProfileInput): Promise<IUser | null>


    // /////////////////////// WEEK - 2 //////////////////////////
    studentGetAllCourses(pageNumber: number, limitNumber: number): Promise<studentGetAllCoursesOuput | null>
    studentGetCourse(courseId: string, userId: string): Promise<StudentGetCourseOuput | null>
    studentCourseFilterData(filterData: StudentCourseFilterData): Promise<studentFilterCoursesOuput | null>

    studentGetCoursePlay(courseId: string): Promise<StudentGetCoursePlayOutput>
    studentBuyCourse(purchaseData: StudentBuyCourseInput): Promise<IPurchasedCourse>
    studentBuyedCourses(studentId: string, pageNumber: number, limitNumber: number): Promise<studentGetBuyedCourses | null>
    studentCoursePlay(purchaseId: string): Promise<StudentCoursePlay>
    studentChapterVideoEnd(chapterId: string, studiedTime: string): Promise<IPurchasedCourse>
    studentGeCerfiticate(certificateId: string): Promise<ICertificate>
    studentCompleteCourse(studentId: string, courseId: string): Promise<studentCompleteCourse>
    studentQuizz(courseId: string): Promise<IQuiz>
    studentCreateCertificate(certificateData: StudentCreateCreatificateData): Promise<ICertificate>
    studentGetAllCertificates(studentId: string): Promise<ICertificate[]>

    // studentIsVerified(studentId: string): Promise<IUser> // !! Important


    // /////////////////////// WEEK - 3 //////////////////////////
    studentChatGetMentors(studentId: string): Promise<StudentChatGetUsersOutput | null>
    studentCreateRoom(studentId: string, mentorId: string): Promise<IChatRooms | null>
    studentSaveMessage(studentId: string, mentorId: string, message: string): Promise<IMessages | null>
    studentGetMessages(studentId: string, mentorId: string): Promise<IMessages[] | null>
    studentDeleteEveryOne(messageId: string): Promise<IMessages | null>
    studentDeleteForMe(messageId: string): Promise<IMessages | null>
    studentResetCount(studentId: string, mentorId: string): Promise<IMessages[] | null>

    // Notifications
    studentCreateNotification(username: string, senderId: string, receiverId: string): Promise<any>
    studentGetNotifications(studentId: string): Promise<IStudentNotification[] | null>
    studentGetNotificationsCount(studentId: string): Promise<any>
    studentGetNotificationsSeen(): Promise<any>
    studentDeleteNotifications(senderId: string): Promise<any>
    studentGetMentor(studentId: string, mentorId: string): Promise<StudentChatGetUsersOutput | null>

    studentGetBadges(studentId: string): Promise<IBadge[] | null>


}


