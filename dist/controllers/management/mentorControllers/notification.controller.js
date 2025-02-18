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
exports.mentorNotificationController = void 0;
const getId_1 = __importDefault(require("../../../integration/getId"));
const notification_services_1 = require("../../../services/business/mentorServices/notification.services");
const responseUtil_1 = require("../../../utils/responseUtil");
class MentorNotificationController {
    constructor(mentorNotificaitonService) {
        this.mentorNotificaitonService = mentorNotificaitonService;
    }
    mentorCreateNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, senderId, receiverId } = req.body;
                const createNotify = yield this.mentorNotificaitonService.mentorCreateNotification(String(username), String(senderId), String(receiverId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "notification created", createNotify);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetNotificationsCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mentorId } = req.params;
                const getCount = yield this.mentorNotificaitonService.mentorGetNotificationsCount(String(mentorId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "count get it", getCount);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mentorId } = req.params;
                const getNotify = yield this.mentorNotificaitonService.mentorGetNotifications(String(mentorId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "get Notificaton", getNotify);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetNotificationsSeen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifySeen = yield this.mentorNotificaitonService.mentorGetNotificationsSeen();
                (0, responseUtil_1.SuccessResponse)(res, 200, "Notificaton seen", notifySeen);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorDeleteNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId } = req.params;
                const deleteNotify = yield this.mentorNotificaitonService.mentorDeleteNotifications(String(senderId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Notificaton deleted", deleteNotify);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.params;
                const mentorId = yield (0, getId_1.default)("accessToken", req);
                const getStudent = yield this.mentorNotificaitonService.mentorGetStudent(String(studentId), mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Student get it", getStudent);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = MentorNotificationController;
exports.mentorNotificationController = new MentorNotificationController(notification_services_1.mentorNotificationServices);
