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
const studentNotification_model_1 = require("../../../models/studentNotification.model");
const mentor_model_1 = __importDefault(require("../../../models/mentor.model"));
const studentBadges_model_1 = require("../../../models/studentBadges.model");
const chatRooms_model_1 = require("../../../models/chatRooms.model");
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class StudentNotificationRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            Notification: studentNotification_model_1.StudentNotificationModel,
            Mentor: mentor_model_1.default,
            ChatRoom: chatRooms_model_1.ChatRoomsModel,
            Badge: studentBadges_model_1.BadgeModel
        });
    }
    studentCreateNotification(username, senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    senderId: new mongoose_1.default.Types.ObjectId(senderId),
                    receiverId: new mongoose_1.default.Types.ObjectId(receiverId),
                    senderName: username
                };
                const createNotification = yield this.createData('Notification', data);
                yield createNotification.save();
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetNotifications(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allNotifications = yield this.findAll('Notification', { receiverId: studentId })
                    .sort({ createdAt: -1 });
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
    studentGetNotificationsCount(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getNotification = yield this.findAll('Notification', { receiverId: studentId, seen: false }).countDocuments();
                return { count: getNotification };
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetNotificationsSeen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const markSeen = yield this.updateMany('Notification', { seen: false }, { $set: { seen: true } });
                return markSeen;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentDeleteNotifications(senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteMessage = yield this.deleteMany('Notification', { senderId });
                return deleteMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetMentor(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findMentor = yield this.findById('Mentor', mentorId).select("_id username profilePicUrl");
                // Fetch the chat room for this student and mentor
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
    studentGetBadges(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findBadges = yield this.findAll('Badge', { userId: studentId })
                    .populate({
                    path: "badgeId",
                    select: "badgeName description value"
                })
                    .sort({ createdAt: -1 });
                return findBadges;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentNotificationRepository;
