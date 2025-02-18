"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatRooms_model_1 = require("../../../models/chatRooms.model");
const purchased_model_1 = require("../../../models/purchased.model");
const messages_model_1 = require("../../../models/messages.model");
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class StudentChatRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            PurchasedCourse: purchased_model_1.PurchasedCourseModel,
            ChatRoom: chatRooms_model_1.ChatRoomsModel,
            Message: messages_model_1.MessageModel
        });
    }
    studentChatGetMentors(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUsers = yield this.findAll('PurchasedCourse', { userId: studentId })
                    .populate({
                    path: "mentorId",
                    select: "_id username profilePicUrl"
                });
                const uniqueMentors = new Set();
                const formatted = [];
                for (const data of getUsers) {
                    const mentor = data.mentorId;
                    if (mentor && !uniqueMentors.has(mentor._id.toString())) {
                        uniqueMentors.add(mentor._id.toString());
                        const getRoom = yield this.findOne('ChatRoom', {
                            studentId,
                            mentorId: mentor._id,
                        });
                        formatted.push({
                            mentorsData: Object.assign(Object.assign({}, mentor.toObject()), { lastMessage: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.lastMessage) || null, userMsgCount: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.userMsgCount) || 0, updatedAt: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.updatedAt) || new Date(0) }),
                            updatedAt: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.updatedAt) || new Date(0),
                        });
                    }
                }
                formatted.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
                return formatted;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCreateRoom(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existRoom = yield this.findOne('ChatRoom', { studentId, mentorId });
                if (existRoom) {
                    return existRoom;
                }
                const roomData = {
                    studentId: new mongoose_1.default.Types.ObjectId(studentId),
                    mentorId: new mongoose_1.default.Types.ObjectId(mentorId)
                };
                const newRoom = yield this.createData('ChatRoom', roomData);
                const createdRoom = yield newRoom.save();
                return createdRoom;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentSaveMessage(studentId, mentorId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findRoom = yield this.findOne('ChatRoom', { studentId, mentorId });
                findRoom.lastMessage = message;
                findRoom.mentorMsgCount += 1;
                yield findRoom.save();
                const data = {
                    senderId: new mongoose_1.default.Types.ObjectId(studentId),
                    receiverId: new mongoose_1.default.Types.ObjectId(mentorId),
                    roomId: new mongoose_1.default.Types.ObjectId(String(findRoom === null || findRoom === void 0 ? void 0 : findRoom._id)),
                    message: message,
                    senderModel: "User",
                    receiverModel: "Mentors"
                };
                const newMessage = yield this.createData('Message', data);
                const savedMessage = yield newMessage.save();
                return savedMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetMessages(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findRoom = yield this.findOne('ChatRoom', { studentId, mentorId });
                const roomId = findRoom._id;
                const findMessages = yield this.findAll('Message', { roomId });
                return findMessages;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentDeleteEveryOne(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findMessage = yield this.findById('Message', messageId);
                findMessage.deletedForSender = true;
                findMessage.deletedForReceiver = true;
                yield findMessage.save();
                // Update chat room's last message if necessary
                const chatRoom = yield this.findOne('ChatRoom', { _id: findMessage.roomId });
                if (chatRoom) {
                    const remainingMessages = yield this.findAll('Message', { roomId: chatRoom._id });
                    const validMessages = remainingMessages.filter(msg => !msg.deletedForSender && !msg.deletedForReceiver);
                    if (validMessages.length > 0) {
                        const lastMessage = validMessages[validMessages.length - 1];
                        chatRoom.lastMessage = lastMessage.message;
                    }
                    else {
                        chatRoom.lastMessage = '';
                    }
                    yield chatRoom.save();
                }
                return findMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentDeleteForMe(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findMessage = yield this.findById('Message', messageId);
                findMessage.deletedForSender = true;
                yield findMessage.save();
                // Check if this is the last message sent by the sender, and update chat room's last message
                const chatRoom = yield this.findOne('ChatRoom', { _id: findMessage.roomId });
                if (chatRoom) {
                    const remainingMessages = yield this.findAll('Message', { roomId: chatRoom._id });
                    const validMessages = remainingMessages.filter(msg => !msg.deletedForSender);
                    if (validMessages.length > 0) {
                        const lastMessage = validMessages[validMessages.length - 1];
                        chatRoom.lastMessage = lastMessage.message;
                    }
                    else {
                        chatRoom.lastMessage = ''; // No valid messages left
                    }
                    yield chatRoom.save();
                }
                return findMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentResetCount(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findRoom = yield this.findOne('ChatRoom', { studentId, mentorId });
                findRoom.userMsgCount = 0;
                yield findRoom.save();
                //find messages
                const findMessages = yield this.findAll('Message', { roomId: findRoom.id });
                return findMessages;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentChatRepository;
