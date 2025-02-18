import MentorNotificationRepository from "../../../repositories/entities/mentorRepositories/notification.repository";


export default class MentorNotificationServices {
    private mentorNotificationRepository: MentorNotificationRepository

    constructor(mentorNotificationRepository: MentorNotificationRepository) {
        this.mentorNotificationRepository = mentorNotificationRepository;
    }

    async mentorCreateNotification(username: string, senderId: string, receiverId: string): Promise<any> {
        try{
            const createNotify = await this.mentorNotificationRepository.mentorCreateNotification(username, senderId, receiverId)
            return createNotify
        }catch(error: unknown){
            throw error
        }
    }

    async mentorGetNotificationsCount(mentorId: string): Promise<any> {
        try{
            const getCount = await this.mentorNotificationRepository.mentorGetNotificationsCount(mentorId)
            return getCount
        }catch(error: unknown){
            throw error
        }
    }

    async mentorGetNotifications(mentorId: string): Promise<any>{
        try{
            const getNotify = await this.mentorNotificationRepository.mentorGetNotifications(mentorId)
            return getNotify
        }catch(error: unknown){
            throw error
        }
    }

    async mentorGetNotificationsSeen(): Promise<any> {
        try{
            const notifySeen = await this.mentorNotificationRepository.mentorGetNotificationsSeen()
            return notifySeen
        }catch(error: unknown){
            throw error
        }
    }

    async mentorDeleteNotifications(senderId: string): Promise<any>{
        try{
            const deleteNotify = await this.mentorNotificationRepository.mentorDeleteNotifications(senderId)
            return deleteNotify
        }catch(error: unknown){
            throw error
        }
    }

    async mentorGetStudent(studentId: string, mentorId: string): Promise<any>{
        try{
            const getStudent = await this.mentorNotificationRepository.mentorGetStudent(studentId, mentorId)
            return getStudent
        }catch(error: unknown){
            throw error
        }
    }

}


const mentorNotificationRepository = new MentorNotificationRepository()
export const mentorNotificationServices = new MentorNotificationServices(mentorNotificationRepository)
