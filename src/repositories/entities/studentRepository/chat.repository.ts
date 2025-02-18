import mongoose from "mongoose";
import { IStudentChatMethods } from "../../../interface/students/student.interface";
import { StudentChatGetUsersOutput } from "../../../interface/students/student.types";
import { ChatRoomsModel, IChatRooms } from "../../../models/chatRooms.model";
import { IMentor } from "../../../models/mentor.model";
import { IPurchasedCourse, PurchasedCourseModel } from "../../../models/purchased.model";
import StudentChatBaseRepository from "../../baseRepositories/studentBaseRepositories/chatBaseRepository";
import { IMessages, MessageModel } from "../../../models/messages.model";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";


export default class StudentChatRepository extends CommonBaseRepository<{
    PurchasedCourse: IPurchasedCourse;
    ChatRoom: IChatRooms;
    Message: IMessages;
}> implements IStudentChatMethods {

    constructor() {
        super({
            PurchasedCourse: PurchasedCourseModel,
            ChatRoom: ChatRoomsModel,
            Message: MessageModel
        })
    }

    async studentChatGetMentors(studentId: string): Promise<any | null> {
        try {
            const getUsers = await this.findAll('PurchasedCourse', { userId: studentId })
                .populate({
                    path: "mentorId",
                    select: "_id username profilePicUrl"
                });

            const uniqueMentors = new Set<string>();
            const formatted: { mentorsData: any; updatedAt: Date }[] = [];

            for (const data of getUsers) {
                const mentor = data.mentorId as unknown as IMentor;
                if (mentor && !uniqueMentors.has(mentor._id.toString())) {
                    uniqueMentors.add(mentor._id.toString());

                    const getRoom = await this.findOne('ChatRoom', {
                        studentId,
                        mentorId: mentor._id,
                    });

                    formatted.push({
                        mentorsData: {
                            ...mentor.toObject(),
                            lastMessage: getRoom?.lastMessage || null,
                            userMsgCount: getRoom?.userMsgCount || 0,
                            updatedAt: getRoom?.updatedAt || new Date(0),
                        },
                        updatedAt: getRoom?.updatedAt || new Date(0),
                    });
                }
            }
            formatted.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

            return formatted
        } catch (error: unknown) {
            throw error
        }
    }

    async studentCreateRoom(studentId: string, mentorId: string): Promise<IChatRooms | null> {
        try {
            const existRoom = await this.findOne('ChatRoom', { studentId, mentorId }) as unknown as IChatRooms
            if (existRoom) {
                return existRoom
            }
            const roomData = {
                studentId: new mongoose.Types.ObjectId(studentId),
                mentorId: new mongoose.Types.ObjectId(mentorId)
            }

            const newRoom = await this.createData('ChatRoom', roomData as unknown as Partial<IChatRooms>)
            const createdRoom = await newRoom.save()
            return createdRoom
        } catch (error: unknown) {
            throw error
        }
    }

    async studentSaveMessage(studentId: string, mentorId: string, message: string): Promise<IMessages | null> {
        try {
            const findRoom = await this.findOne('ChatRoom', { studentId, mentorId }) as IChatRooms
            findRoom.lastMessage = message
            findRoom.mentorMsgCount += 1
            await findRoom.save()

            const data: any = {
                senderId: new mongoose.Types.ObjectId(studentId),
                receiverId: new mongoose.Types.ObjectId(mentorId),
                roomId: new mongoose.Types.ObjectId(String(findRoom?._id)),
                message: message,
                senderModel: "User",
                receiverModel: "Mentors"
            }
            const newMessage = await this.createData('Message', data as unknown as Partial<IMessages>)
            const savedMessage = await newMessage.save()
            return savedMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async studentGetMessages(studentId: string, mentorId: string): Promise<any> {
        try {
            const findRoom = await this.findOne('ChatRoom', { studentId, mentorId }) as unknown as IChatRooms
            const roomId = findRoom._id
            const findMessages = await this.findAll('Message', { roomId })
            return findMessages
        } catch (error: unknown) {
            throw error
        }
    }

    async studentDeleteEveryOne(messageId: string): Promise<any> {
        try {
            const findMessage = await this.findById('Message', messageId) as unknown as IMessages
            findMessage.deletedForSender = true
            findMessage.deletedForReceiver = true
            await findMessage.save()
            // Update chat room's last message if necessary
            const chatRoom = await this.findOne('ChatRoom', { _id: findMessage.roomId });

            if (chatRoom) {
                const remainingMessages = await this.findAll('Message', { roomId: chatRoom._id });
                const validMessages = remainingMessages.filter(msg => !msg.deletedForSender && !msg.deletedForReceiver);

                if (validMessages.length > 0) {
                    const lastMessage = validMessages[validMessages.length - 1];
                    chatRoom.lastMessage = lastMessage.message;
                } else {
                    chatRoom.lastMessage = '';
                }

                await chatRoom.save();
            }
            return findMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async studentDeleteForMe(messageId: string): Promise<any> {
        try {
            const findMessage = await this.findById('Message', messageId) as unknown as IMessages
            findMessage.deletedForSender = true
            await findMessage.save()
            // Check if this is the last message sent by the sender, and update chat room's last message
            const chatRoom = await this.findOne('ChatRoom', { _id: findMessage.roomId });

            if (chatRoom) {
                const remainingMessages = await this.findAll('Message', { roomId: chatRoom._id });
                const validMessages = remainingMessages.filter(msg => !msg.deletedForSender);

                if (validMessages.length > 0) {
                    const lastMessage = validMessages[validMessages.length - 1];
                    chatRoom.lastMessage = lastMessage.message;
                } else {
                    chatRoom.lastMessage = '';  // No valid messages left
                }

                await chatRoom.save();
            }
            return findMessage
        } catch (error: unknown) {
            throw error
        }
    }

    async studentResetCount(studentId: string, mentorId: string): Promise<any> {
        try {
            const findRoom = await this.findOne('ChatRoom', { studentId, mentorId }) as unknown as IChatRooms
            findRoom.userMsgCount = 0
            await findRoom.save()

            //find messages
            const findMessages = await this.findAll('Message', { roomId: findRoom.id })
            return findMessages
        } catch (error: unknown) {
            throw error
        }
    }

}