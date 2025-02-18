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
exports.mentorQuizzServices = void 0;
const quizz_repository_1 = __importDefault(require("../../../repositories/entities/mentorRepositories/quizz.repository"));
class MentorQuizzServices {
    constructor(mentorQuizzRepository) {
        this.mentorQuizzRepository = mentorQuizzRepository;
    }
    mentorAddQuizz(data, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addQuizz = yield this.mentorQuizzRepository.mentorAddQuizz(data, courseId);
                return addQuizz;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllQuizz(courseId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllQuizz = yield this.mentorQuizzRepository.mentorGetAllQuizz(courseId, mentorId);
                return getAllQuizz;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorDeleteQuizz(courseId, quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteQuiz = yield this.mentorQuizzRepository.mentorDeleteQuizz(courseId, quizId);
                return deleteQuiz;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetWallet(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getWallet = yield this.mentorQuizzRepository.mentorGetWallet(userId, page, limit);
                return getWallet;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorQuizzServices;
const mentorQuizzRepository = new quizz_repository_1.default();
exports.mentorQuizzServices = new MentorQuizzServices(mentorQuizzRepository);
