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
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
class UserServices {
    constructor() {
        this.userRepositories = new userRepository_1.default();
    }
    //new
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.userRepositories.findByEmail(email);
            return response;
        });
    }
    studentSignup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const addStudent = yield this.userRepositories.studentSignup(data);
            return addStudent;
        });
    }
    studentGoogleSignIn(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            const addStudent = yield this.userRepositories.studentGoogleSignIn(email, displayName);
            return addStudent;
        });
    }
    studentGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const addStudent = yield this.userRepositories.studentGoogleLogin(email);
            return addStudent;
        });
    }
    studentLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUser = yield this.userRepositories.studentLogin(email, password);
            return loggedUser;
        });
    }
    verifyUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.userRepositories.verifyUser(email);
            return response;
        });
    }
    forgetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.userRepositories.forgetPassword(data);
            return response;
        });
    }
    checkStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.userRepositories.checkStudent(id);
            return response;
        });
    }
    studentReVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.userRepositories.studentReVerify(email);
            return response;
        });
    }
    isUserBlocked(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.userRepositories.isUserBlocked(email);
            return response;
        });
    }
    profileUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.userRepositories.profileUpdate(id, data);
            return response;
        });
    }
    /* ------------------------------ WEEK -2 -------------------------*/
    // public async getAllCourses(): Promise<any> {
    //     try {
    //         const response = await this.userRepositories.getAllCourses()
    //         return response
    //     } catch (error: any) {
    //         throw error
    //     }
    // }
    getAllCourses(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Call the repository to get the courses with pagination
                const response = yield this.userRepositories.getAllCourses(page, limit);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepositories.getCourse(id);
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
                const response = yield this.userRepositories.getCoursePlay(id);
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
                // const response = await this.userRepositories.filterData(filters)
                const response = yield this.userRepositories.filterData(page, limit, String(selectedCategory), String(selectedLevel), String(searchTerm));
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepositories.findCourseById(courseId);
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
                const response = yield this.userRepositories.findChaptersById(courseId);
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
                const response = yield this.userRepositories.buyCourse(userId, courseId, chapters, txnid);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getBuyedCourses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepositories.getBuyedCourses(userId);
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
                const response = yield this.userRepositories.coursePlay(buyedId);
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
                const response = yield this.userRepositories.chapterVideoEnd(chapterId);
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
                const response = yield this.userRepositories.getCertificate(certificateId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserServices;
