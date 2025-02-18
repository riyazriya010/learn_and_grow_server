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
const mentorWallet_model_1 = require("../../../models/mentorWallet.model");
const quizz_model_1 = __importDefault(require("../../../models/quizz.model"));
const uploadCourse_model_1 = require("../../../models/uploadCourse.model");
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class MentorQuizzRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            Quizz: quizz_model_1.default,
            MentorWallet: mentorWallet_model_1.MentorWalletModel,
            Course: uploadCourse_model_1.CourseModel
        });
    }
    mentorAddQuizz(data, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findQuizz = yield this.findOne('Quizz', { courseId: courseId });
                const questionData = {
                    question: data.question,
                    options: [data.option1, data.option2],
                    correct_answer: data.correctAnswer,
                };
                const questionExist = findQuizz === null || findQuizz === void 0 ? void 0 : findQuizz.questions.some(q => q.question === data.question);
                if (questionExist) {
                    const error = new Error('Question Already Exist');
                    error.name = 'QuestionAlreadyExist';
                    throw error;
                }
                if (findQuizz) {
                    findQuizz.questions.push(questionData);
                    yield findQuizz.save();
                    return findQuizz;
                }
                const quizData = {
                    courseId: new mongoose_1.default.Types.ObjectId(courseId),
                    questions: [questionData]
                };
                const newQuizz = yield this.createData('Quizz', quizData);
                return newQuizz;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllQuizz(courseId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCourse = yield this.findOne('Course', { _id: courseId, mentorId });
                if (!findCourse) {
                    return [];
                }
                const getAllQuizz = yield this.findAll('Quizz', { courseId });
                return getAllQuizz;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorDeleteQuizz(courseId, quizzId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findQuizz = yield this.findOne('Quizz', { courseId });
                const objectIdQuizId = new mongoose_1.default.Types.ObjectId(quizzId);
                findQuizz.questions = findQuizz.questions.filter((question) => !question._id.equals(objectIdQuizId));
                const updatedQuizz = yield findQuizz.save();
                return updatedQuizz;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetWallet(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const response = yield this.findAll('MentorWallet', { mentorId: userId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .select("-__v"); // Exclude the `__v` field if unnecessary
                // Count total wallet documents for the mentor
                const totalWallets = yield this.findAll('MentorWallet', { mentorId: userId }).countDocuments();
                return {
                    wallets: response, // Renamed to `wallets` for better readability
                    currentPage: page,
                    totalPages: Math.ceil(totalWallets / limit),
                    totalWallets,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorQuizzRepository;
