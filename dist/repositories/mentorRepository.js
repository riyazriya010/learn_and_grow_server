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
exports.MentorRepository = void 0;
const categroy_model_1 = require("../models/categroy.model");
const chapter_model_1 = require("../models/chapter.model");
const mentor_model_1 = __importDefault(require("../models/mentor.model"));
const quizz_model_1 = __importDefault(require("../models/quizz.model"));
const uploadCourse_model_1 = require("../models/uploadCourse.model");
const mentorBase_repository_1 = __importDefault(require("./baseRepo/mentorBase.repository"));
const mentorWallet_model_1 = require("../models/mentorWallet.model");
class MentorRepository {
    constructor() {
        this.baseRepository = new mentorBase_repository_1.default(mentor_model_1.default);
        this.courseBaseRepository = new mentorBase_repository_1.default(uploadCourse_model_1.CourseModel);
        this.chapterBaseRepository = new mentorBase_repository_1.default(chapter_model_1.ChapterModel);
        this.categoryBaseRepository = new mentorBase_repository_1.default(categroy_model_1.CategoryModel);
        this.quizzBaseRepository = new mentorBase_repository_1.default(quizz_model_1.default);
        this.walletBaseRepository = new mentorBase_repository_1.default(mentorWallet_model_1.MentorWalletModel);
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.findByEmail(email);
            return response;
        });
    }
    mentorSignUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.mentorSignUp(data);
            return response;
        });
    }
    mentorLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUser = yield this.baseRepository.mentorLogin(email, password);
            return loggedUser;
        });
    }
    forgetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.forgetPassword(data);
            return response;
        });
    }
    mentorGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const addedUser = yield this.baseRepository.mentorGoogleLogin(email);
            return addedUser;
        });
    }
    mentorGoogleSignUp(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            const addedUser = yield this.baseRepository.mentorGoogleSignUp(email, displayName);
            return addedUser;
        });
    }
    profileUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.profileUpdate(id, data);
            return response;
        });
    }
    checkMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.checkStudent(id);
            return response;
        });
    }
    isUserBlocked(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.isUserBlocked(email);
            return response;
        });
    }
    mentorReVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.mentorReVerify(email);
            return response;
        });
    }
    verifyMentor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.verifyMentor(email);
            return response;
        });
    }
    isBlocked(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.isBlocked(id);
            return response;
        });
    }
    isVerified(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.isVerified(id);
            return response;
        });
    }
    /* -------------------------- WEEK - 2 ---------------------------------- */
    addCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.courseBaseRepository.addCourse(data);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    editCourse(courseId, updatedFields) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.courseBaseRepository.editCourse(courseId, updatedFields);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    unPublishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.courseBaseRepository.unPublishCourse(courseId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    publishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.courseBaseRepository.publishCourse(courseId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    filterCourse(page, limit, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.courseBaseRepository.filterCourse(page, limit, String(searchTerm));
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllCourses(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.courseBaseRepository.getAllCourses(page, limit);
            return response;
        });
    }
    getCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.courseBaseRepository.getCourse(courseId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.categoryBaseRepository.getAllCategory();
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    editChapter(title, description, chapterId, location) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.chapterBaseRepository.editChapter(title, description, chapterId, location);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllChapters(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.chapterBaseRepository.getAllChapters(courseId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addQuizz(data, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.quizzBaseRepository.addQuizz(data, courseId);
                return response;
            }
            catch (error) {
                // console.error('Error in repository layer:', error);
                throw error;
            }
        });
    }
    getAllQuizz(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.quizzBaseRepository.getAllQuizz(courseId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteQuizz(courseId, quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.quizzBaseRepository.deleteQuizz(courseId, quizId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getWallet(userId, pageNumber, limitNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.walletBaseRepository.getWallet(userId, pageNumber, limitNumber);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.MentorRepository = MentorRepository;
