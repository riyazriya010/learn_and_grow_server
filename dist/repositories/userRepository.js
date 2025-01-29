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
// import User, { IUser } from "../models/user.model";
const userBase_repository_1 = __importDefault(require("./baseRepo/userBase.repository"));
const user_model_1 = __importDefault(require("../models/user.model"));
const uploadCourse_model_1 = require("../models/uploadCourse.model");
const chapter_model_1 = require("../models/chapter.model");
const purchased_model_1 = require("../models/purchased.model");
const certificate_model_1 = require("../models/certificate.model");
const quizz_model_1 = __importDefault(require("../models/quizz.model"));
class UserRepositories {
    constructor() {
        this.baseRepository = new userBase_repository_1.default(user_model_1.default);
        this.courseBaseRepository = new userBase_repository_1.default(uploadCourse_model_1.CourseModel);
        this.chapterBaseRepository = new userBase_repository_1.default(chapter_model_1.ChapterModel);
        this.purchaseBaseRepository = new userBase_repository_1.default(purchased_model_1.PurchasedCourseModel);
        this.certificateBaseRepository = new userBase_repository_1.default(certificate_model_1.CertificateModel);
        this.quizzBaseRepository = new userBase_repository_1.default(quizz_model_1.default);
    }
    // new
    studentSignup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addedUser = yield this.baseRepository.signupStudent(data);
                return addedUser;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'UserAlreadyExit') {
                        throw error;
                    }
                }
                throw error;
            }
        });
    }
    studentGoogleSignIn(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addedUser = yield this.baseRepository.studentGoogleSignIn(email, displayName);
                return addedUser;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'UserAlreadyExit') {
                        throw error;
                    }
                }
                throw error;
            }
        });
    }
    studentGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addedUser = yield this.baseRepository.studentGoogleLogin(email);
                return addedUser;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'UserNotFound' || error.name === 'UserBlocked') {
                        throw error;
                    }
                }
                throw error;
            }
        });
    }
    studentLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUser = yield this.baseRepository.studentLogin(email, password);
            return loggedUser;
        });
    }
    verifyUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.verifyUser(email);
            return response;
        });
    }
    forgetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.forgetPassword(data);
            return response;
        });
    }
    checkStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.checkStudent(id);
            return response;
        });
    }
    studentReVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.studentReVerify(email);
            return response;
        });
    }
    isUserBlocked(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.isUserBlocked(email);
            return response;
        });
    }
    profileUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.profileUpdate(id, data);
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
    /*------------------------------------ WEEK - 2 ---------------------------------*/
    getAllCourses(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.courseBaseRepository.getAllCourses(page, limit);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCourse(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.courseBaseRepository.getCourse(id, userId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCoursePlay(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.courseBaseRepository.getCoursePlay(id);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    filterData(page, limit, selectedCategory, selectedLevel, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const response = await this.courseBaseRepository.filterData(filters)
                const response = yield this.courseBaseRepository.filterData(page, limit, String(selectedCategory), String(selectedLevel), String(searchTerm));
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findCourseById(courseId, amount, courseName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.courseBaseRepository.findCourseById(courseId, amount, courseName);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findChaptersById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.chapterBaseRepository.findChaptersById(courseId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    buyCourse(userId, courseId, chapters, txnid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.purchaseBaseRepository.buyCourse(userId, courseId, chapters, txnid);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getBuyedCourses(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.purchaseBaseRepository.getBuyedCourses(userId, page, limit);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    coursePlay(buyedId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.purchaseBaseRepository.coursePlay(buyedId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    chapterVideoEnd(chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.purchaseBaseRepository.chapterVideoEnd(chapterId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCertificate(certificateId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.certificateBaseRepository.getCertificate(certificateId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getQuizz(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.quizzBaseRepository.getQuizz(courseId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    completeCourse(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.purchaseBaseRepository.completeCourse(userId, courseId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    createCertificate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.certificateBaseRepository.createCertificate(data);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCertificates(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.certificateBaseRepository.getCertificates(userId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserRepositories;
