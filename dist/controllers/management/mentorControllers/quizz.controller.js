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
exports.mentorQuizzController = void 0;
const quizz_services_1 = require("../../../services/business/mentorServices/quizz.services");
const responseUtil_1 = require("../../../utils/responseUtil");
const getId_1 = __importDefault(require("../../../integration/getId"));
class MentorQuizzController {
    constructor(mentorQuizzServices) {
        this.mentorQuizzServices = mentorQuizzServices;
    }
    mentorAddQuizz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const data = req.body;
                const addQuizz = yield this.mentorQuizzServices.mentorAddQuizz(data, String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Quiz Added", addQuizz);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'QuestionAlreadyExist') {
                        (0, responseUtil_1.ErrorResponse)(res, 403, "Quizz Exists");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetAllQuizz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                const getAllQuizz = yield this.mentorQuizzServices.mentorGetAllQuizz(String(courseId), mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, " Get All Quizz", getAllQuizz);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorDeleteQuizz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId, quizId } = req.query;
                const deleteQuizz = yield this.mentorQuizzServices.mentorDeleteQuizz(String(courseId), String(quizId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Quiz Deleted", deleteQuizz);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 4 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                const userId = yield (0, getId_1.default)('accessToken', req);
                const getWallet = yield this.mentorQuizzServices.mentorGetWallet(String(userId), Number(page), Number(limit));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Wallet Got It", getWallet);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = MentorQuizzController;
exports.mentorQuizzController = new MentorQuizzController(quizz_services_1.mentorQuizzServices);
