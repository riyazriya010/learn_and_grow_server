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
const mailToken_1 = require("../../integration/mailToken");
const nodemailer_1 = __importDefault(require("../../integration/nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class MentorServices {
    constructor(mentorMethods) {
        this.mentorRepository = mentorMethods;
    }
    mentorLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logUser = yield this.mentorRepository.mentorLogin(email, password);
                if (!logUser) {
                    const error = new Error('Email Not Found');
                    error.name = 'EmailNotFound';
                    throw error;
                }
                const isPassword = yield bcrypt_1.default.compare(password, logUser.password);
                if (!isPassword) {
                    const error = new Error('Password Invalid');
                    error.name = 'PasswordInvalid';
                    throw error;
                }
                if (logUser.isBlocked) {
                    const error = new Error('Mentor Blocked');
                    error.name = 'MentorBlocked';
                    throw error;
                }
                return logUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorSignUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashPassword = yield bcrypt_1.default.hash(data.password, 10);
                data.password = hashPassword;
                const addedMentor = yield this.mentorRepository.mentorSignUp(data);
                const token = yield (0, mailToken_1.generateAccessToken)({ id: String(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor._id), email: String(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor.email) });
                const portLink = process.env.MENTOR_PORT_LINK;
                const createdLink = `${portLink}?token=${token}`;
                const mail = new nodemailer_1.default();
                mail.sendVerificationEmail(String(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor.email), createdLink)
                    .then(info => {
                    console.log('Verification email sent successfully:');
                })
                    .catch(error => {
                    console.error('Failed to send verification email:', error);
                });
                return addedMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGoogleSignUp(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addedMentor = yield this.mentorRepository.mentorGoogleSignUp(email, displayName);
                return addedMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logMentor = yield this.mentorRepository.mentorGoogleLogin(email);
                if (!logMentor) {
                    const error = new Error('Email Not Found');
                    error.name = 'EmailNotFound';
                    throw error;
                }
                if (logMentor.isBlocked) {
                    const error = new Error('Mentor Blocked');
                    error.name = 'MentorBlocked';
                    throw error;
                }
                return logMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorForgetPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashPassword = yield bcrypt_1.default.hash(password, 10);
                password = hashPassword;
                const updatedMentor = yield this.mentorRepository.mentorForgetPassword(email, password);
                return updatedMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorProfileUpdate(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedProfile = yield this.mentorRepository.mentorProfileUpdate(userId, data);
                return updatedProfile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorCheck(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkMentor = yield this.mentorRepository.mentorCheck(userId);
                return checkMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyUser = yield this.mentorRepository.mentorVerify(email);
                return verifyUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorReVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifiedUser = yield this.mentorRepository.mentorReVerify(email);
                return verifiedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    ///////////////////////////////////// WEEK - 2 ///////////////////////////////
    mentorAddCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addCourse = yield this.mentorRepository.mentorAddCourse(data);
                return addCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllCourse(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllCourses = yield this.mentorRepository.mentorGetAllCourse(userId, page, limit);
                return getAllCourses;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCourse = yield this.mentorRepository.mentorGetCourse(courseId);
                return getCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorEditCourse(courseId, updatedFields) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editCourse = yield this.mentorRepository.mentorEditCourse(courseId, updatedFields);
                return editCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorUnPulishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unPublish = yield this.mentorRepository.mentorUnPulishCourse(courseId);
                return unPublish;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorPublishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const publish = yield this.mentorRepository.mentorPublishCourse(courseId);
                return publish;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorFilterCourse(page, limit, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filterCourse = yield this.mentorRepository.mentorFilterCourse(page, limit, searchTerm);
                return filterCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllCategorise() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllCategories = yield this.mentorRepository.mentorGetAllCategorise();
                return getAllCategories;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorAddChapter(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploadChapter = yield this.mentorRepository.mentorAddChapter(data);
                return uploadChapter;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorEditChapter(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editChapter = yield this.mentorRepository.mentorEditChapter(data);
                return editChapter;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllChapters(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getChapters = yield this.mentorRepository.mentorGetAllChapters(courseId);
                return getChapters;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorAddQuizz(data, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addQuizz = yield this.mentorRepository.mentorAddQuizz(data, courseId);
                return addQuizz;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllQuizz(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllQuizz = yield this.mentorRepository.mentorGetAllQuizz(courseId);
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
                const deleteQuiz = yield this.mentorRepository.mentorDeleteQuizz(courseId, quizId);
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
                const getWallet = yield this.mentorRepository.mentorGetWallet(userId, page, limit);
                return getWallet;
            }
            catch (error) {
                throw error;
            }
        });
    }
    //////////////////////////////// WEEK - 3 //////////////////////////////////
    mentorChatGetStudents(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getMentor = yield this.mentorRepository.mentorChatGetStudents(mentorId);
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
                const getMessage = yield this.mentorRepository.mentorGetMessages(studentId, mentorId);
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
                const saveMessage = yield this.mentorRepository.mentorSaveMessage(studentId, mentorId, message);
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
                const createdRoom = yield this.mentorRepository.mentorCreateRoom(studentId, mentorId);
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
                const deleteForEveryOne = yield this.mentorRepository.mentorDeleteEveryOne(messageId);
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
                const deleteForMe = yield this.mentorRepository.mentorDeleteForMe(messageId);
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
                const resetCount = yield this.mentorRepository.mentorResetCount(studentId, mentorId);
                return resetCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
    //Notification
    mentorCreateNotification(username, senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createNotify = yield this.mentorRepository.mentorCreateNotification(username, senderId, receiverId);
                return createNotify;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetNotificationsCount(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCount = yield this.mentorRepository.mentorGetNotificationsCount(mentorId);
                return getCount;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetNotifications(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getNotify = yield this.mentorRepository.mentorGetNotifications(mentorId);
                return getNotify;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetNotificationsSeen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifySeen = yield this.mentorRepository.mentorGetNotificationsSeen();
                return notifySeen;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorDeleteNotifications(senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteNotify = yield this.mentorRepository.mentorDeleteNotifications(senderId);
                return deleteNotify;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetStudent(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getStudent = yield this.mentorRepository.mentorGetStudent(studentId, mentorId);
                return getStudent;
            }
            catch (error) {
                throw error;
            }
        });
    }
    ///////////////////////////////// WEEK - 4 ///////////////////////////
    mentorDashboard(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getData = yield this.mentorRepository.mentorDashboard(mentorId);
                return getData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorChartGraph(mentorId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getData = yield this.mentorRepository.mentorChartGraph(mentorId, filters);
                return getData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorSalesReport(mentorId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getData = yield this.mentorRepository.mentorSalesReport(mentorId, filters);
                return getData;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorServices;
