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
exports.mentorchatController = void 0;
const chat_services_1 = require("../../../services/business/mentorServices/chat.services");
const responseUtil_1 = require("../../../utils/responseUtil");
const getId_1 = __importDefault(require("../../../integration/getId"));
class MentorChatController {
    constructor(mentorChatServices) {
        this.mentorChatServices = mentorChatServices;
    }
    mentorChatGetStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mentorId = (0, getId_1.default)("accessToken", req);
                const getStudent = yield this.mentorChatServices.mentorChatGetStudents(mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Students Got It", getStudent);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.params;
                const mentorId = (0, getId_1.default)("accessToken", req);
                const getMessage = yield this.mentorChatServices.mentorGetMessages(String(studentId), mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Messages Got It", getMessage);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorSaveMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message, studentId } = req.body;
                const mentorId = (0, getId_1.default)("accessToken", req);
                const saveMessage = yield this.mentorChatServices.mentorSaveMessage(studentId, String(mentorId), String(message));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Message saved", saveMessage);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorCreateRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.body;
                const mentorId = (0, getId_1.default)("accessToken", req);
                const createdRoom = yield this.mentorChatServices.mentorCreateRoom(String(studentId), mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Room Created", createdRoom);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorDeleteEveryOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { messageId } = req.params;
                const deleteForEveryOne = yield this.mentorChatServices.mentorDeleteEveryOne(String(messageId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Message Deleted For EveryOne", deleteForEveryOne);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorDeleteForMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { messageId } = req.params;
                const deleteForMe = yield this.mentorChatServices.mentorDeleteForMe(String(messageId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Message Deleted For Me", deleteForMe);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorResetCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.params;
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                const resetCount = yield this.mentorChatServices.mentorResetCount(String(studentId), mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "count reset", resetCount);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = MentorChatController;
exports.mentorchatController = new MentorChatController(chat_services_1.mentorChatServices);
