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
const mentorNotification_model_1 = require("../../../models/mentorNotification.model");
const user_model_1 = __importDefault(require("../../../models/user.model"));
const chatRooms_model_1 = require("../../../models/chatRooms.model");
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class MentorNotificationRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            MentorNotification: mentorNotification_model_1.MentorNotificationModel,
            User: user_model_1.default,
            ChatRoom: chatRooms_model_1.ChatRoomsModel
        });
    }
    mentorCreateNotification(username, senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    senderId: new mongoose_1.default.Types.ObjectId(senderId),
                    receiverId: new mongoose_1.default.Types.ObjectId(receiverId),
                    senderName: username
                };
                const createNotification = yield this.createData('MentorNotification', data);
                yield createNotification.save();
                return createNotification;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetNotificationsCount(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getNotification = yield this.findAll('MentorNotification', { receiverId: mentorId, seen: false }).countDocuments();
                return { count: getNotification };
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetNotifications(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allNotifications = yield this.findAll('MentorNotification', { receiverId: mentorId })
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
                return uniqueNotifications;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetNotificationsSeen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const markSeen = yield this.updateMany('MentorNotification', { seen: false }, { $set: { seen: true } });
                return markSeen;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorDeleteNotifications(senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteMessage = yield this.deleteMany('MentorNotification', { senderId });
                return deleteMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetStudent(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findMentor = yield this.findById('User', studentId).select("_id username profilePicUrl");
                const getRoom = yield this.findOne('ChatRoom', {
                    studentId,
                    mentorId,
                });
                return Object.assign(Object.assign({}, findMentor === null || findMentor === void 0 ? void 0 : findMentor.toObject()), { lastMessage: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.lastMessage) || null, userMsgCount: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.userMsgCount) || 0 });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorNotificationRepository;
