import mongoose from "mongoose";
import { IStudentNotificationMethods } from "../../../interface/students/student.interface";
import { IStudentNotification, StudentNotificationModel } from "../../../models/studentNotification.model";
import StudentNotificationBaseRepository from "../../baseRepositories/studentBaseRepositories/notificationBaseRepository";
import MentorModel, { IMentor } from "../../../models/mentor.model";
import { BadgeModel, IBadge } from "../../../models/studentBadges.model";
import { ChatRoomsModel, IChatRooms } from "../../../models/chatRooms.model";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";


export default class StudentNotificationRepository extends CommonBaseRepository<{
    Notification: IStudentNotification;
    ChatRoom: IChatRooms;
    Mentor: IMentor;
    Badge: IBadge;
}> implements IStudentNotificationMethods {

    constructor() {
        super({
            Notification: StudentNotificationModel,
            Mentor: MentorModel,
            ChatRoom: ChatRoomsModel,
            Badge: BadgeModel
        })
    }

    async studentCreateNotification(username: string, senderId: string, receiverId: string): Promise<any> {
        try {
            const data = {
                senderId: new mongoose.Types.ObjectId(senderId),
                receiverId: new mongoose.Types.ObjectId(receiverId),
                senderName: username
            }
            const createNotification = await this.createData('Notification',data as unknown as Partial<IStudentNotification>)
            await createNotification.save()
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetNotifications(studentId: string): Promise<any> {
        try {
            const allNotifications = await this.findAll('Notification',{ receiverId: studentId })
                .sort({ createdAt: -1 });

            const seenSenders = new Set();
            const uniqueNotifications = allNotifications.filter(notification => {
                if (!seenSenders.has(notification.senderId.toString())) {
                    seenSenders.add(notification.senderId.toString());
                    return true;
                }
                return false;
            });
            return uniqueNotifications
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetNotificationsCount(studentId: string): Promise<any> {
        try {
            const getNotification = await this.findAll('Notification',{ receiverId: studentId, seen: false }).countDocuments()
            return { count: getNotification }
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetNotificationsSeen(): Promise<any> {
        try {
            const markSeen = await this.updateMany('Notification',
                { seen: false },
                { $set: { seen: true } }
            );
            return markSeen
        } catch (error: unknown) {
            throw error
        }
    }

    async studentDeleteNotifications(senderId: string): Promise<any> {
        try {
            const deleteMessage = await this.deleteMany('Notification',{ senderId })
            return deleteMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetMentor(studentId: string, mentorId: string): Promise<any> {
        try {
            const findMentor = await this.findById('Mentor',mentorId).select("_id username profilePicUrl");

            // Fetch the chat room for this student and mentor
            const getRoom = await this.findOne('ChatRoom',{
                studentId,
                mentorId,
            });

            return {
                ...findMentor?.toObject(),
                lastMessage: getRoom?.lastMessage || null,
                userMsgCount: getRoom?.userMsgCount || 0,
            }

        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetBadges(studentId: string): Promise<IBadge[] | null> {
        try {
            const findBadges = await this.findAll('Badge',{ userId: studentId })
                .populate({
                    path: "badgeId",
                    select: "badgeName description value"
                })
                .sort({ createdAt: -1 });

            return findBadges;
        } catch (error: unknown) {
            throw error
        }
    }

}