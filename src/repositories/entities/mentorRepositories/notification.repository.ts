import mongoose from "mongoose";
import { IMentorNotificationMethods } from "../../../interface/mentors/mentor.interface";
import { IMentorNotification, MentorNotificationModel } from "../../../models/mentorNotification.model";
import UserModel, { IUser } from "../../../models/user.model";
import { ChatRoomsModel, IChatRooms } from "../../../models/chatRooms.model";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";


export default class MentorNotificationRepository extends CommonBaseRepository<{
    MentorNotification: IMentorNotification;
    User: IUser;
    ChatRoom: IChatRooms;
}> implements IMentorNotificationMethods {

    constructor() {
        super({
            MentorNotification: MentorNotificationModel,
            User: UserModel,
            ChatRoom: ChatRoomsModel
        })
    }

    async mentorCreateNotification(username: string, senderId: string, receiverId: string): Promise<any> {
        try {
            const data = {
                senderId: new mongoose.Types.ObjectId(senderId),
                receiverId: new mongoose.Types.ObjectId(receiverId),
                senderName: username
            }
            const createNotification = await this.createData('MentorNotification', data as unknown as Partial<IMentorNotification>)
            await createNotification.save()
            return createNotification
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetNotificationsCount(mentorId: string): Promise<any> {
        try {
            const getNotification = await this.findAll('MentorNotification',{ receiverId: mentorId, seen: false }).countDocuments()
            return { count: getNotification }
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetNotifications(mentorId: string): Promise<any> {
        try {
            const allNotifications = await this.findAll('MentorNotification',{ receiverId: mentorId })
                .sort({ createdAt: -1 });

            // Remove duplicate senderId notifications (keeping only the most recent)
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

    async mentorGetNotificationsSeen(): Promise<any> {
        try {
            const markSeen = await this.updateMany('MentorNotification',
                { seen: false },
                { $set: { seen: true } }
            );
            return markSeen
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorDeleteNotifications(senderId: string): Promise<any> {
        try {
            const deleteMessage = await this.deleteMany('MentorNotification',{ senderId })
            return deleteMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async mentorGetStudent(studentId: string, mentorId: string): Promise<any> {
        try {
            const findMentor = await this.findById('User',studentId).select("_id username profilePicUrl");

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

}