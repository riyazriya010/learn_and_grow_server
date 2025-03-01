import mongoose from "mongoose";
import { IMentorChatMethods } from "../../../interface/mentors/mentor.interface";
import { ChatRoomsModel, IChatRooms } from "../../../models/chatRooms.model";
import { IMessages, MessageModel } from "../../../models/messages.model";
import { IUser } from "../../../models/user.model";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";


export default class MentorChatRepository extends CommonBaseRepository<{
    ChatRoom: IChatRooms
    Message: IMessages
}> implements IMentorChatMethods {

    constructor() {
        super({
            ChatRoom: ChatRoomsModel,
            Message: MessageModel
        })
    }

        async mentorChatGetStudents(mentorId: string): Promise<any> {
            try {
                const getUsers = await this.findAll('ChatRoom', { mentorId })
                    .populate({
                        path: "studentId",
                        select: "_id username profilePicUrl"
                    });
    
                const uniqueStudents = new Set<string>();
                const formatted: { studentData: any; updatedAt: Date }[] = [];
    
                for (const data of getUsers) {
                    const student = data.studentId as unknown as IUser;
                    if (student && !uniqueStudents.has(student._id.toString())) {
                        uniqueStudents.add(student._id.toString());
    
                        // Fetch the chat room for this student and mentor
                        const getRoom = await this.findOne('ChatRoom',{
                            mentorId,
                            studentId: student._id,
                        });
    
                        // Add student data with lastMessage and updatedAt
                        formatted.push({
                            studentData: {
                                ...student.toObject(),
                                lastMessage: getRoom?.lastMessage || null,
                                mentorMsgCount: getRoom?.mentorMsgCount || 0,
                            },
                            updatedAt: getRoom?.updatedAt || new Date(0), // Default to old date if no chat exists
                        });
                    }
                }
                formatted.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    
                return formatted
            } catch (error: unknown) {
                throw error
            }
        }
    
        async mentorGetMessages(studentId: string, mentorId: string): Promise<any> {
            try {
                const findRoom = await this.findOne('ChatRoom',{ studentId, mentorId }) as unknown as IChatRooms
                const roomId = findRoom._id
                const findMessages = await this.findAll('Message',{ roomId })
                console.log('findMessages ', findMessages)
                return findMessages
            } catch (error: unknown) {
                throw error
            }
        }
    
        async mentorSaveMessage(studentId: string, mentorId: string, message: string): Promise<any> {
            try {
                const findRoom = await this.findOne('ChatRoom',{ studentId, mentorId }) as IChatRooms
                findRoom.lastMessage = message
                findRoom.userMsgCount += 1
                await findRoom.save()
    
                const data: any = {
                    senderId: new mongoose.Types.ObjectId(mentorId),
                    receiverId: new mongoose.Types.ObjectId(studentId),
                    roomId: new mongoose.Types.ObjectId(String(findRoom?._id)),
                    message: message,
                    senderModel: "Mentors",
                    receiverModel: "User"
                }
                const newMessage = await this.createData('Message', data as unknown as Partial<IMessages>)
                const savedMessage = await newMessage.save()
    
                return savedMessage
            } catch (error: unknown) {
                throw error
            }
        }
    
        async mentorCreateRoom(studentId: string, mentorId: string): Promise<any> {
            try {
                const existRoom = await this.findOne('ChatRoom',{ studentId, mentorId }) as unknown as IChatRooms
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
    
        async mentorDeleteEveryOne(messageId: string): Promise<any> {
            try {
                const findMessage = await this.findById('Message',messageId) as unknown as IMessages
                findMessage.deletedForSender = true
                findMessage.deletedForReceiver = true
                await findMessage.save()
                // Update chat room's last message if necessary
                const chatRoom = await this.findOne('ChatRoom',{ _id: findMessage.roomId });
    
                if (chatRoom) {
                    const remainingMessages = await this.findAll('Message',{ roomId: chatRoom._id });
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
    
        async mentorDeleteForMe(messageId: string): Promise<any> {
            try {
                const findMessage = await this.findById('Message',messageId) as unknown as IMessages
                findMessage.deletedForSender = true
                await findMessage.save()
                // Check if this is the last message sent by the sender, and update chat room's last message
                const chatRoom = await this.findOne('ChatRoom',{ _id: findMessage.roomId });
    
                if (chatRoom) {
                    const remainingMessages = await this.findAll('Message',{ roomId: chatRoom._id });
                    const validMessages = remainingMessages.filter(msg => !msg.deletedForSender);
    
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
    
        async mentorResetCount(studentId: string, mentorId: string): Promise<any> {
            try {
                const findRoom = await this.findOne('ChatRoom',{ studentId, mentorId }) as unknown as IChatRooms
                findRoom.mentorMsgCount = 0
                await findRoom.save()
    
                //find messages
                const findMessages = await this.findAll('Message',{ roomId: findRoom.id })
                return findMessages
            } catch (error: unknown) {
                throw error
            }
        }

}