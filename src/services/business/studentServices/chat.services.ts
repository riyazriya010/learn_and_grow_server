import { StudentChatGetUsersOutput } from "../../../interface/students/student.types";
import StudentChatRepository from "../../../repositories/entities/studentRepository/chat.repository";


export default class StudentChatServices {
    private studentChatRepository: StudentChatRepository

    constructor(studentChatRepository: StudentChatRepository) {
        this.studentChatRepository = studentChatRepository;
    }

    async studentChatGetMentors(studentId: string): Promise<StudentChatGetUsersOutput | null> {
        try {
            const getMentors = await this.studentChatRepository.studentChatGetMentors(studentId)
            return getMentors
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCreateRoom(studentId: string, mentorId: string): Promise<any> {
        try {
            const createdRoom = await this.studentChatRepository.studentCreateRoom(studentId, mentorId)
            return createdRoom
        } catch (error: unknown) {
            throw error
        }
    }

    async studentSaveMessage(studentId: string, mentorId: string, message: string): Promise<any> {
        try {
            const savedMessage = await this.studentChatRepository.studentSaveMessage(studentId, mentorId, message)
            return savedMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetMessages(studentId: string, mentorId: string): Promise<any> {
        try {
            const getMessage = await this.studentChatRepository.studentGetMessages(studentId, mentorId)
            return getMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async studentDeleteEveryOne(messageId: string): Promise<any> {
        try {
            const deleteEveryOne = await this.studentChatRepository.studentDeleteEveryOne(messageId)
            return deleteEveryOne
        } catch (error: unknown) {
            throw error
        }
    }

    async studentDeleteForMe(messageId: string): Promise<any> {
        try {
            const deleteForMe = await this.studentChatRepository.studentDeleteForMe(messageId)
            return deleteForMe
        } catch (error: unknown) {
            throw error
        }
    }

    async studentResetCount(studentId: string, mentorId: string): Promise<any> {
        try {
            const resetCount = await this.studentChatRepository.studentResetCount(studentId, mentorId)
            return resetCount
        } catch (error: unknown) {
            throw error
        }
    }

}

const chatRepository = new StudentChatRepository()
export const chatServices = new StudentChatServices(chatRepository)