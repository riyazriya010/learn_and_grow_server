import { ICertificate } from "../../models/certificate.model";
import { IChatRooms } from "../../models/chatRooms.model";
import { IMessages } from "../../models/messages.model";
import { IPurchasedCourse } from "../../models/purchased.model";
import { IQuiz } from "../../models/quizz.model";
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
    studentChapterVideoEnd(chapterId: string): Promise<IPurchasedCourse>
    studentGeCerfiticate(certificateId: string): Promise<ICertificate>
    studentCompleteCourse(studentId: string, courseId: string): Promise<studentCompleteCourse>
    studentQuizz(courseId: string): Promise<IQuiz>
    studentCreateCertificate(certificateData: StudentCreateCreatificateData): Promise<ICertificate>
    studentGetAllCertificates(studentId: string): Promise<ICertificate[]>

    // studentIsVerified(studentId: string): Promise<IUser> // !! Important
    

    // /////////////////////// WEEK - 3 //////////////////////////
    studentChatGetUsers(studentId: string): Promise<StudentChatGetUsersOutput | null>
    studentCreateRoom(studentId: string, mentorId: string): Promise<IChatRooms | null>
    studentGetMessages(roomId: string): Promise<IMessages[] | null>
    studentSaveMessage(message: string, roomId: string, receiverId: string, senderId: string): Promise<IMessages | null>
}


