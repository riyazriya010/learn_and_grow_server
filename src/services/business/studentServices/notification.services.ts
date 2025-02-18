import { IBadge } from "../../../models/studentBadges.model";
import StudentNotificationRepository from "../../../repositories/entities/studentRepository/notification.repository";


export default class StudentNotificationServices {
    private studentNotificationRepository: StudentNotificationRepository

    constructor(studentNotificationRepository: StudentNotificationRepository) {
        this.studentNotificationRepository = studentNotificationRepository;
    }

        async studentCreateNotification(username: string, senderId: string, receiverId: string): Promise<any> {
            try {
                const createNotify = await this.studentNotificationRepository.studentCreateNotification(username, senderId, receiverId)
                return createNotify
            } catch (error: unknown) {
                throw error
            }
        }
    
        async studentGetNotifications(studentId: string): Promise<any> {
            try {
                const getNotification = await this.studentNotificationRepository.studentGetNotifications(studentId)
                return getNotification
            } catch (error: unknown) {
                throw error
            }
        }
    
        async studentGetNotificationsCount(studentId: string): Promise<any> {
            try{
                const getCount = await this.studentNotificationRepository.studentGetNotificationsCount(studentId)
                return getCount
            }catch(error: unknown){
                throw error
            }
        }
    
        async studentGetNotificationsSeen(): Promise<any> {
            try{
                const markSeen = await this.studentNotificationRepository.studentGetNotificationsSeen()
                return markSeen
            }catch(error: unknown){
                throw error
            }
        }
    
        async studentDeleteNotifications(senderId: string): Promise<any> {
            try{
                const deleteNotify = await this.studentNotificationRepository.studentDeleteNotifications(senderId)
                return deleteNotify
            }catch(error: unknown){
                throw error
            }
        }
    
        async studentGetMentor(studentId: string, mentorId: string): Promise<any> {
            try{
                const getMentor = await this.studentNotificationRepository.studentGetMentor(studentId, mentorId)
                return getMentor
            }catch(error: unknown){
                throw error
            }
        }
    
        async studentGetBadges(studentId: string): Promise<IBadge[] | null> {
            try {
                const getBadges = await this.studentNotificationRepository.studentGetBadges(studentId)
                return getBadges
            } catch (error: unknown) {
                throw error
            }
        }

}

const notificationRepository = new StudentNotificationRepository()
export const notificationServices = new StudentNotificationServices(notificationRepository)