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
exports.chatServices = void 0;
const chat_repository_1 = __importDefault(require("../../../repositories/entities/studentRepository/chat.repository"));
class StudentChatServices {
    constructor(studentChatRepository) {
        this.studentChatRepository = studentChatRepository;
    }
    studentChatGetMentors(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getMentors = yield this.studentChatRepository.studentChatGetMentors(studentId);
                return getMentors;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCreateRoom(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdRoom = yield this.studentChatRepository.studentCreateRoom(studentId, mentorId);
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
                const savedMessage = yield this.studentChatRepository.studentSaveMessage(studentId, mentorId, message);
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
                const getMessage = yield this.studentChatRepository.studentGetMessages(studentId, mentorId);
                return getMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentDeleteEveryOne(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteEveryOne = yield this.studentChatRepository.studentDeleteEveryOne(messageId);
                return deleteEveryOne;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentDeleteForMe(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteForMe = yield this.studentChatRepository.studentDeleteForMe(messageId);
                return deleteForMe;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentResetCount(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resetCount = yield this.studentChatRepository.studentResetCount(studentId, mentorId);
                return resetCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentChatServices;
const chatRepository = new chat_repository_1.default();
exports.chatServices = new StudentChatServices(chatRepository);
