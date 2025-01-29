import { ICategory } from "../../models/categroy.model";
import { IChapter } from "../../models/chapter.model";
import { IChatRooms } from "../../models/chatRooms.model";
import { IMentor } from "../../models/mentor.model";
import { IMentorWallet } from "../../models/mentorWallet.model";
import { IMessages } from "../../models/messages.model";
import { IQuiz } from "../../models/quizz.model";
import { ICourse } from "../../models/uploadCourse.model";
import { MentorAddChapterInput, MentorAddQuizInput, MentorChatGetRoomsOutput, MentorEditChapterInput, MentorEditCourseInput, mentorFilterCourse, mentorGetALlCourseOuput, MentorProfileUpdateInput, MentorSignUpInput, mentorWalletOutput } from "./mentor.types";

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

        mentorChatGetRooms(mentorId: string): Promise<MentorChatGetRoomsOutput | null>
        mentorCreateRoom(studentId: string, mentorId: string): Promise<IChatRooms | null>
        mentorGetMessages(roomId: string): Promise<IMessages[] | null>
        mentorSaveMessage(message: string, roomId: string, receiverId: string, senderId: string): Promise<IMessages | null>
}