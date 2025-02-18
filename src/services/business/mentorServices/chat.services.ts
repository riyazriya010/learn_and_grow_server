import MentorChatRepository from "../../../repositories/entities/mentorRepositories/chat.repository";




export default class MentorChatServices {
    private mentorChatRepository: MentorChatRepository

    constructor(mentorChatRepository: MentorChatRepository) {
        this.mentorChatRepository = mentorChatRepository;
    }

    async mentorChatGetStudents(mentorId: string): Promise<any>{
        try{
            const getMentor = await this.mentorChatRepository.mentorChatGetStudents(mentorId)
            return getMentor
        }catch(error: unknown){
            throw error
        }
    }

    async mentorGetMessages(studentId: string, mentorId: string): Promise<any> {
        try{
            const getMessage = await this.mentorChatRepository.mentorGetMessages(studentId, mentorId)
            return getMessage
        }catch(error: unknown){
            throw error
        }
    }

    async mentorSaveMessage(studentId: string, mentorId: string, message: string): Promise<any> {
        try{
            const saveMessage = await this.mentorChatRepository.mentorSaveMessage(studentId, mentorId, message)
            return saveMessage
        }catch(error: unknown){
            throw error
        }
    }

    async mentorCreateRoom(studentId: string, mentorId: string): Promise<any> {
        try{
            const createdRoom = await this.mentorChatRepository.mentorCreateRoom(studentId, mentorId)
            return createdRoom
        }catch(error: unknown){
            throw error
        }
    }

    async mentorDeleteEveryOne(messageId: string): Promise<any> {
        try{
            const deleteForEveryOne = await this.mentorChatRepository.mentorDeleteEveryOne(messageId)
            return deleteForEveryOne
        }catch(error: unknown){
            throw error
        }
    }

    async mentorDeleteForMe(messageId: string): Promise<any> {
        try{
            const deleteForMe = await this.mentorChatRepository.mentorDeleteForMe(messageId)
            return deleteForMe
        }catch(error: unknown){
            throw error
        }
    }

    async mentorResetCount(studentId: string, mentorId: string): Promise<any> {
        try{
            const resetCount = await this.mentorChatRepository.mentorResetCount(studentId, mentorId)
            return resetCount
        }catch(error: unknown){
            throw error
        }
    }

}

const mentorChatRepository = new MentorChatRepository()
export const mentorChatServices = new MentorChatServices(mentorChatRepository)
