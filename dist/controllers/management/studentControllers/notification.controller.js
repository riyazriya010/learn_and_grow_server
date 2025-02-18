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
exports.studentNotificationController = void 0;
const notification_services_1 = require("../../../services/business/studentServices/notification.services");
const responseUtil_1 = require("../../../utils/responseUtil");
const getId_1 = __importDefault(require("../../../integration/getId"));
class StudentNotificationController {
    constructor(studentNotificationServices) {
        this.studentNotificationServices = studentNotificationServices;
    }
    studentCreateNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('noti ', req.body);
                const { username, senderId, receiverId } = req.body;
                const createNotify = yield this.studentNotificationServices.studentCreateNotification(String(username), String(senderId), String(receiverId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "notification created", createNotify);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.params;
                const getNotification = yield this.studentNotificationServices.studentGetNotifications(String(studentId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "notification got it", getNotification);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetNotificationsCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.params;
                const getCount = yield this.studentNotificationServices.studentGetNotificationsCount(String(studentId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "count got it", getCount);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetNotificationsSeen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const markSeen = yield this.studentNotificationServices.studentGetNotificationsSeen();
                (0, responseUtil_1.SuccessResponse)(res, 200, "marked seen", markSeen);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentDeleteNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId } = req.params;
                const deleteNotify = yield this.studentNotificationServices.studentDeleteNotifications(String(senderId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "notification deleted", deleteNotify);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetMentor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mentorId } = req.params;
                const studentId = yield (0, getId_1.default)("accessToken", req);
                const getMentor = yield this.studentNotificationServices.studentGetMentor(studentId, String(mentorId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "mentor got it", getMentor);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetBadges(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const getBadges = yield this.studentNotificationServices.studentGetBadges(studentId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Badges Got It", getBadges);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
}
exports.default = StudentNotificationController;
exports.studentNotificationController = new StudentNotificationController(notification_services_1.notificationServices);
