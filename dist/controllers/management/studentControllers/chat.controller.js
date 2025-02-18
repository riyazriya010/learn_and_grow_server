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
exports.studentChatController = void 0;
const chat_services_1 = require("../../../services/business/studentServices/chat.services");
const responseUtil_1 = require("../../../utils/responseUtil");
const getId_1 = __importDefault(require("../../../integration/getId"));
class StudentChatController {
    constructor(studentChatServices) {
        this.studentChatServices = studentChatServices;
    }
    studentChatGetMentors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = (0, getId_1.default)("accessToken", req);
                const getMentors = yield this.studentChatServices.studentChatGetMentors(studentId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Mentors Got It", getMentors);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentCreateRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mentorId } = req.body;
                const studentId = (0, getId_1.default)("accessToken", req);
                const createdRoom = yield this.studentChatServices.studentCreateRoom(studentId, String(mentorId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Room Created", createdRoom);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentSaveMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message, mentorId } = req.body;
                const studentId = (0, getId_1.default)("accessToken", req);
                const savedMessage = yield this.studentChatServices.studentSaveMessage(studentId, String(mentorId), String(message));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Message Saved", savedMessage);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mentorId } = req.params;
                const studentId = (0, getId_1.default)("accessToken", req);
                const getMessage = yield this.studentChatServices.studentGetMessages(studentId, String(mentorId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Message Got It", getMessage);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentDeleteEveryOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { messageId } = req.params;
                const deleteEveryOne = yield this.studentChatServices.studentDeleteEveryOne(String(messageId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Message deleted foreveryone", deleteEveryOne);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentDeleteForMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { messageId } = req.params;
                const deleteForMe = yield this.studentChatServices.studentDeleteForMe(String(messageId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Message deleted me", deleteForMe);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentResetCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mentorId } = req.params;
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const resetCount = yield this.studentChatServices.studentResetCount(studentId, String(mentorId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Count Reset", resetCount);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
}
exports.default = StudentChatController;
exports.studentChatController = new StudentChatController(chat_services_1.chatServices);
