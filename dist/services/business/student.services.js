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
class StudentServices {
    constructor(studentRepository) {
        this.studentRepository = studentRepository;
    }
    //////////////////////// WEEK - 1 ////////////////////////////////////
    studentLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.studentRepository.studentLogin(email, String(password));
                console.log('find ', findUser);
                if (!findUser) {
                    const error = new Error('Email Not Found');
                    error.name = 'EmailNotFound';
                    throw error;
                }
                const isPassword = yield bcrypt_1.default.compare(password, findUser.password);
                if (!isPassword) {
                    const error = new Error('Password Invalid');
                    error.name = 'PasswordInvalid';
                    throw error;
                }
                console.log('pass ', isPassword);
                if (findUser.isBlocked) {
                    const error = new Error('Student Blocked');
                    error.name = 'StudentBlocked';
                    throw error;
                }
                console.log('uernot block: ', findUser);
                return findUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentSignUp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashPassword = yield bcrypt_1.default.hash(userData.password, 10);
                userData.password = hashPassword;
                const addUser = yield this.studentRepository.studentSignUp(userData);
                const token = yield (0, mailToken_1.generateAccessToken)({ id: String(addUser === null || addUser === void 0 ? void 0 : addUser._id), email: String(addUser === null || addUser === void 0 ? void 0 : addUser.email) });
                const portLink = process.env.STUDENT_PORT_LINK;
                const createdLink = `${portLink}?token=${token}`;
                const mail = new nodemailer_1.default();
                mail.sendVerificationEmail(String(addUser === null || addUser === void 0 ? void 0 : addUser.email), createdLink)
                    .then(info => {
                    console.log('Verification email sent successfully:');
                })
                    .catch(error => {
                    console.error('Failed to send verification email:', error);
                });
                return addUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGoogleSignUp(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addUser = yield this.studentRepository.studentGoogleSignUp({ email, displayName });
                return addUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.studentRepository.studentGoogleLogin(email);
                return findUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentForgetPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashPassword = yield bcrypt_1.default.hash(password, 10);
                password = hashPassword;
                const updatePassword = yield this.studentRepository.studentForgetPassword(email, password);
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentVerify(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifiedToken = yield (0, mailToken_1.verifyToken)(token);
                if (!verifiedToken.status) {
                    const error = new Error('Token Expired');
                    error.name = 'tokenExpired';
                    throw error;
                }
                const payload = verifiedToken.payload;
                if (!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)) {
                    const error = new Error('Invalid token payload');
                    error.name = 'Invalidtokenpayload';
                    throw error;
                }
                const { email } = payload;
                const verifyStudent = yield this.studentRepository.studentVerify(email);
                return verifyStudent;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentProfleUpdate(studentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateUser = yield this.studentRepository.studentProfleUpdate(studentId, data);
                return updateUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentReVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.studentRepository.studentReVerify(email);
                const token = yield (0, mailToken_1.generateAccessToken)({ id: String(findUser === null || findUser === void 0 ? void 0 : findUser._id), email: email });
                const portLink = process.env.STUDENT_PORT_LINK;
                const createdLink = `${portLink}?token=${token}`;
                const mail = new nodemailer_1.default();
                mail.sendVerificationEmail(email, createdLink)
                    .then(info => {
                    console.log('Verification email sent successfully:');
                })
                    .catch(error => {
                    console.error('Failed to send verification email:', error);
                });
                return findUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCheck(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkStudent = yield this.studentRepository.studentCheck(studentId);
                return checkStudent;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetAllCourses(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    const error = new Error('Invalid Page or Limit Value');
                    error.name = 'InvalidPageOrLimit';
                    throw error;
                }
                const getAllCourse = yield this.studentRepository.studentGetAllCourses(pageNumber, limitNumber);
                return getAllCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetCourse(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCourse = yield this.studentRepository.studentGetCourse(courseId, studentId);
                return getCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCourseFilterData(filterData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = parseInt(String(filterData.pageNumber), 10);
                const limitNumber = parseInt(String(filterData.limitNumber), 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    const error = new Error('Invalid Page or Limit Value');
                    error.name = 'InvalidPageOrLimit';
                    throw error;
                }
                const filteredCourse = yield this.studentRepository.studentCourseFilterData({
                    pageNumber,
                    limitNumber,
                    selectedCategory: filterData.selectedCategory,
                    selectedLevel: filterData.selectedLevel,
                    searchTerm: filterData.searchTerm
                });
                return filteredCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetCoursePlay(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCoursePlay = yield this.studentRepository.studentGetCoursePlay(courseId);
                return getCoursePlay;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentBuyCourse(purchaseData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buyCourse = yield this.studentRepository.studentBuyCourse(purchaseData);
                return buyCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentBuyedCourses(studentId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                const buyedCourse = yield this.studentRepository.studentBuyedCourses(studentId, pageNumber, limitNumber);
                //main logic here
                if (buyedCourse === null || buyedCourse === void 0 ? void 0 : buyedCourse.courses) {
                    const formattedResponse = (_a = buyedCourse === null || buyedCourse === void 0 ? void 0 : buyedCourse.courses) === null || _a === void 0 ? void 0 : _a.map((course) => ({
                        _id: course._id,
                        courseDetails: {
                            courseName: course.courseId.courseName,
                            level: course.courseId.level,
                        },
                        completedChapters: course.completedChapters,
                        isCourseCompleted: course.isCourseCompleted,
                        purchasedAt: course.purchasedAt,
                    }));
                    buyedCourse.courses = formattedResponse;
                }
                return buyedCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCoursePlay(purchaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coursePlay = yield this.studentRepository.studentCoursePlay(purchaseId);
                return coursePlay;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentChapterVideoEnd(chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCoures = yield this.studentRepository.studentChapterVideoEnd(chapterId);
                return findCoures;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGeCerfiticate(certificateId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCertificate = yield this.studentRepository.studentGeCerfiticate(certificateId);
                return getCertificate;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCompleteCourse(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const completeCourse = yield this.studentRepository.studentCompleteCourse(studentId, courseId);
                return completeCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentQuizz(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getQuizz = yield this.studentRepository.studentQuizz(courseId);
                return getQuizz;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCreateCertificate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createCertificate = yield this.studentRepository.studentCreateCertificate(data);
                return createCertificate;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetAllCertificates(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCertificates = yield this.studentRepository.studentGetAllCertificates(studentId);
                return getCertificates;
            }
            catch (error) {
                throw error;
            }
        });
    }
    ///////////////////////// WEEk - 3 ////////////////////////////
    studentChatGetUsers(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUsers = yield this.studentRepository.studentChatGetUsers(studentId);
                return getUsers;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCreateRoom(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createRoom = yield this.studentRepository.studentCreateRoom(studentId, mentorId);
                return createRoom;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetMessages(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getMessage = yield this.studentRepository.studentGetMessages(roomId);
                return getMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentSaveMessage(message, roomId, receiverId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedMessage = yield this.studentRepository.studentSaveMessage(message, roomId, receiverId, senderId);
                return savedMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentServices;
