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
exports.mentorChatServices = void 0;
const chat_repository_1 = __importDefault(require("../../../repositories/entities/mentorRepositories/chat.repository"));
class MentorChatServices {
    constructor(mentorChatRepository) {
        this.mentorChatRepository = mentorChatRepository;
    }
    mentorChatGetStudents(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getMentor = yield this.mentorChatRepository.mentorChatGetStudents(mentorId);
                return getMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetMessages(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getMessage = yield this.mentorChatRepository.mentorGetMessages(studentId, mentorId);
                return getMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorSaveMessage(studentId, mentorId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveMessage = yield this.mentorChatRepository.mentorSaveMessage(studentId, mentorId, message);
                return saveMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorCreateRoom(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdRoom = yield this.mentorChatRepository.mentorCreateRoom(studentId, mentorId);
                return createdRoom;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorDeleteEveryOne(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteForEveryOne = yield this.mentorChatRepository.mentorDeleteEveryOne(messageId);
                return deleteForEveryOne;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorDeleteForMe(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteForMe = yield this.mentorChatRepository.mentorDeleteForMe(messageId);
                return deleteForMe;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorResetCount(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resetCount = yield this.mentorChatRepository.mentorResetCount(studentId, mentorId);
                return resetCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorChatServices;
const mentorChatRepository = new chat_repository_1.default();
exports.mentorChatServices = new MentorChatServices(mentorChatRepository);
