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
exports.notificationServices = void 0;
const notification_repository_1 = __importDefault(require("../../../repositories/entities/studentRepository/notification.repository"));
class StudentNotificationServices {
    constructor(studentNotificationRepository) {
        this.studentNotificationRepository = studentNotificationRepository;
    }
    studentCreateNotification(username, senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createNotify = yield this.studentNotificationRepository.studentCreateNotification(username, senderId, receiverId);
                return createNotify;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetNotifications(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getNotification = yield this.studentNotificationRepository.studentGetNotifications(studentId);
                return getNotification;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetNotificationsCount(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCount = yield this.studentNotificationRepository.studentGetNotificationsCount(studentId);
                return getCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetNotificationsSeen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const markSeen = yield this.studentNotificationRepository.studentGetNotificationsSeen();
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
                const deleteNotify = yield this.studentNotificationRepository.studentDeleteNotifications(senderId);
                return deleteNotify;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetMentor(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getMentor = yield this.studentNotificationRepository.studentGetMentor(studentId, mentorId);
                return getMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetBadges(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getBadges = yield this.studentNotificationRepository.studentGetBadges(studentId);
                return getBadges;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentNotificationServices;
const notificationRepository = new notification_repository_1.default();
exports.notificationServices = new StudentNotificationServices(notificationRepository);
