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
exports.mentorNotificationServices = void 0;
const notification_repository_1 = __importDefault(require("../../../repositories/entities/mentorRepositories/notification.repository"));
class MentorNotificationServices {
    constructor(mentorNotificationRepository) {
        this.mentorNotificationRepository = mentorNotificationRepository;
    }
    mentorCreateNotification(username, senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createNotify = yield this.mentorNotificationRepository.mentorCreateNotification(username, senderId, receiverId);
                return createNotify;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetNotificationsCount(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCount = yield this.mentorNotificationRepository.mentorGetNotificationsCount(mentorId);
                return getCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetNotifications(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getNotify = yield this.mentorNotificationRepository.mentorGetNotifications(mentorId);
                return getNotify;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetNotificationsSeen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifySeen = yield this.mentorNotificationRepository.mentorGetNotificationsSeen();
                return notifySeen;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorDeleteNotifications(senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteNotify = yield this.mentorNotificationRepository.mentorDeleteNotifications(senderId);
                return deleteNotify;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetStudent(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getStudent = yield this.mentorNotificationRepository.mentorGetStudent(studentId, mentorId);
                return getStudent;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorNotificationServices;
const mentorNotificationRepository = new notification_repository_1.default();
exports.mentorNotificationServices = new MentorNotificationServices(mentorNotificationRepository);
