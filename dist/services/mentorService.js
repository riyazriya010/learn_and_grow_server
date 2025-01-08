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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorServices = void 0;
const mentorRepository_1 = require("../repositories/mentorRepository");
class MentorServices {
    constructor() {
        this.mentorRepository = new mentorRepository_1.MentorRepository();
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.mentorRepository.findByEmail(email);
            return response;
        });
    }
    mentorSignUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.mentorRepository.mentorSignUp(data);
            return response;
        });
    }
    mentorLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUser = yield this.mentorRepository.mentorLogin(email, password);
            return loggedUser;
        });
    }
    forgetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.mentorRepository.forgetPassword(data);
            return response;
        });
    }
    mentorGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const addStudent = yield this.mentorRepository.mentorGoogleLogin(email);
            return addStudent;
        });
    }
    mentorGoogleSignUp(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            const addStudent = yield this.mentorRepository.mentorGoogleSignUp(email, displayName);
            return addStudent;
        });
    }
    profileUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.mentorRepository.profileUpdate(id, data);
            return response;
        });
    }
    checkMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.mentorRepository.checkMentor(id);
            return response;
        });
    }
    isUserBlocked(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.mentorRepository.isUserBlocked(email);
            return response;
        });
    }
    mentorReVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.mentorRepository.mentorReVerify(email);
            return response;
        });
    }
    verifyMentor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.mentorRepository.verifyMentor(email);
            return response;
        });
    }
    /*---------------------------------- WEEK - 2 -------------------------------*/
    addCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.mentorRepository.addCourse(data);
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
                const response = yield this.mentorRepository.editCourse(courseId, updatedFields);
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
                const response = yield this.mentorRepository.unPublishCourse(courseId);
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
                const response = yield this.mentorRepository.publishCourse(courseId);
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
                const response = yield this.mentorRepository.filterCourse(page, limit, String(searchTerm));
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllCourses(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.mentorRepository.getAllCourses(page, limit);
            return response;
        });
    }
    getCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.mentorRepository.getCourse(courseId);
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
                const response = yield this.mentorRepository.editChapter(title, description, chapterId, location);
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
                const response = yield this.mentorRepository.getAllCategory();
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
                const response = yield this.mentorRepository.getAllChapters(courseId);
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
                const response = yield this.mentorRepository.addQuizz(data, courseId);
                return response;
            }
            catch (error) {
                // console.error('Error in service layer:', error);
                throw error;
            }
        });
    }
    getAllQuizz(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.mentorRepository.getAllQuizz(courseId);
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
                const response = yield this.mentorRepository.deleteQuizz(courseId, quizId);
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
                const response = yield this.mentorRepository.getWallet(userId, pageNumber, limitNumber);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.MentorServices = MentorServices;
