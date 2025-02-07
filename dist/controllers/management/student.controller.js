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
const jwt_1 = require("../../integration/jwt");
const responseUtil_1 = require("../../utils/responseUtil");
const getId_1 = __importDefault(require("../../integration/getId"));
class StudentController {
    constructor(studentServices) {
        this.studentServices = studentServices;
        this.jwtService = new jwt_1.JwtService();
    }
    /////////////////////////////////// WEEK - 1 //////////////////////////////
    studentLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const response = yield this.studentServices.studentLogin(email, password);
                const accessToken = yield this.jwtService.createToken(response === null || response === void 0 ? void 0 : response._id, String(response === null || response === void 0 ? void 0 : response.role));
                const refreshToken = yield this.jwtService.createRefreshToken(response === null || response === void 0 ? void 0 : response._id, String(response === null || response === void 0 ? void 0 : response.role));
                return res
                    .status(200)
                    .cookie('accessToken', accessToken, {
                    httpOnly: false
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true
                })
                    .send({
                    success: true,
                    message: 'User Logged Successfully',
                    result: response
                });
                // SuccessResponse(res, 200, 'Student Found', response, String(accessToken), String(refreshToken))
                // return
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'PasswordInvalid' || error.name === 'EmailNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, "Invalid Credentials");
                        return;
                    }
                    if (error.name === 'StudentBlocked') {
                        (0, responseUtil_1.ErrorResponse)(res, 403, "Student Blocked");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, phone, password } = req.body;
                const addUser = yield this.studentServices.studentSignUp({ username, email, phone, password });
                const accessToken = yield this.jwtService.createToken(addUser === null || addUser === void 0 ? void 0 : addUser._id, String(addUser === null || addUser === void 0 ? void 0 : addUser.role));
                const refreshToken = yield this.jwtService.createRefreshToken(addUser === null || addUser === void 0 ? void 0 : addUser._id, String(addUser === null || addUser === void 0 ? void 0 : addUser.role));
                return res
                    .status(200)
                    .cookie('accessToken', accessToken, {
                    httpOnly: false
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true
                })
                    .send({
                    success: true,
                    message: 'User signup Successfully',
                    result: addUser
                });
                // SuccessResponse(res, 201, " Student Added Successfully", addUser, String(accessToken), String(refreshToken))
                // return
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'UserExist') {
                        (0, responseUtil_1.ErrorResponse)(res, 409, 'User Already Exists');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGoogleSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, displayName } = req.body;
                const addStudent = yield this.studentServices.studentGoogleSignUp(email, displayName);
                const accessToken = yield this.jwtService.createToken(addStudent === null || addStudent === void 0 ? void 0 : addStudent._id, String(addStudent === null || addStudent === void 0 ? void 0 : addStudent.role));
                const refreshToken = yield this.jwtService.createRefreshToken(addStudent === null || addStudent === void 0 ? void 0 : addStudent._id, String(addStudent === null || addStudent === void 0 ? void 0 : addStudent.role));
                return res
                    .status(200)
                    .cookie('accessToken', accessToken, {
                    httpOnly: false
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true
                })
                    .send({
                    success: true,
                    message: 'User Google Signup Successfully',
                    result: addStudent
                });
                // SuccessResponse(res, 201, 'Student Added Successfully', addStudent, String(accessToken), String(refreshToken))
                // return
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'UserExist') {
                        (0, responseUtil_1.ErrorResponse)(res, 409, 'User Already Exists');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGoogleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const findUser = yield this.studentServices.studentGoogleLogin(email);
                const accessToken = yield this.jwtService.createToken(findUser === null || findUser === void 0 ? void 0 : findUser._id, String(findUser === null || findUser === void 0 ? void 0 : findUser.role));
                const refreshToken = yield this.jwtService.createRefreshToken(findUser === null || findUser === void 0 ? void 0 : findUser._id, String(findUser === null || findUser === void 0 ? void 0 : findUser.role));
                return res
                    .status(200)
                    .cookie('accessToken', accessToken, {
                    httpOnly: false
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true
                })
                    .send({
                    success: true,
                    message: 'User Logged Successfully',
                    result: findUser
                });
                // SuccessResponse(res, 200, "Student Found", findUser, String(accessToken), String(refreshToken))
                // return
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'UserNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, "User Not Found Please SignUp");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentForgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const updatePassword = yield this.studentServices.studentForgetPassword(email, password);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Password Updated Successfully");
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'UserNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, "Email Not Found Please try another Email");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.query.token;
                const verifySudent = yield this.studentServices.studentVerify(token);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Student Verified", verifySudent);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'tokenExpired') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, "Token Expired Please GoTo Profile");
                        return;
                    }
                    if (error.name === 'UserNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, "Email Not Found Please try another Email");
                        return;
                    }
                    if (error.name === 'Invalidtokenpayload') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, "Invalid Token Payload");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentProfleUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file;
                const { username, phone } = req.body;
                const data = {
                    username,
                    phone,
                    profilePicUrl: file === null || file === void 0 ? void 0 : file.location
                };
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const updateUser = yield this.studentServices.studentProfleUpdate(String(studentId), data);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Student Profile Updated", updateUser);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentReVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.query.email;
                const verifiedUesr = yield this.studentServices.studentReVerify(String(email));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Student Verified", verifiedUesr);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'UserNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, "Email Not Found Please try another Email");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentCheck(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = req.query.userId;
                const checkStudent = yield this.studentServices.studentCheck(String(studentId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Uesr Got It", checkStudent);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    /////////////////////////////////// WEEK - 2 //////////////////////////////
    studentGetAllCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 6 } = req.query;
                const getAllCourses = yield this.studentServices.studentGetAllCourses(String(page), String(limit));
                (0, responseUtil_1.SuccessResponse)(res, 200, "All Course Got It", getAllCourses);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'CoursesNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, "Courses Not Found");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log('req.query: ', req.query);
                const courseId = req.query.courseId;
                const studentId = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.userId;
                const getCourse = yield this.studentServices.studentGetCourse(String(courseId), String(studentId));
                console.log('getCourse: ', getCourse);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Got It", getCourse);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentCourseFilterData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 6 } = req.query;
                const { selectedCategory, selectedLevel, searchTerm } = req.query;
                const filteredCourse = yield this.studentServices.studentCourseFilterData({
                    pageNumber: Number(page),
                    limitNumber: Number(limit),
                    selectedCategory: String(selectedCategory),
                    selectedLevel: String(selectedLevel),
                    searchTerm: String(searchTerm)
                });
                (0, responseUtil_1.SuccessResponse)(res, 200, "Data Filtered", filteredCourse);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'CourseNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, "Courses Not Found");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetCoursePlay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.query;
                const getCoursePlay = yield this.studentServices.studentGetCoursePlay(String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Got It", getCoursePlay);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'CourseNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, "Course Not Found");
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentBuyCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId, txnid, amount, courseName } = req.body;
                const userId = yield (0, getId_1.default)('accessToken', req);
                const buyCourse = yield this.studentServices.studentBuyCourse({ userId, courseId, txnid, amount });
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Buyed Successfully", buyCourse);
                return;
            }
            catch (error) {
                console.log('payment error ', error);
                if (error instanceof Error) {
                    (0, responseUtil_1.ErrorResponse)(res, 404, "Chapters Not Found");
                    return;
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentBuyedCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('buyedCourse controller ', req.query);
                const { page = 1, limit = 4 } = req.query;
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const buyedCourse = yield this.studentServices.studentBuyedCourses(studentId, String(page), String(limit));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Buyed Courses Got It", buyedCourse);
                return;
            }
            catch (error) {
                console.info('error ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentCoursePlay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const purchaseId = req.query.buyedId;
                const coursePlay = yield this.studentServices.studentCoursePlay(String(purchaseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Got It For Play", coursePlay);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentChapterVideoEnd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chapterId } = req.query;
                const findCoures = yield this.studentServices.studentChapterVideoEnd(String(chapterId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Chapter Video Ended", findCoures);
                return;
            }
            catch (error) {
                console.log('chap end ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGeCerfiticate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { certificateId } = req.query;
                const getCertificate = yield this.studentServices.studentGeCerfiticate(String(certificateId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Certificate Got It", getCertificate);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentCompleteCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const { courseId } = req.query;
                const completeCourse = yield this.studentServices.studentCompleteCourse(String(studentId), String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Corse Completed", completeCourse);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === "CourseAlreadyCompleted") {
                        (0, responseUtil_1.ErrorResponse)(res, 401, "Course Already Completed");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentQuizz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const getQuizz = yield this.studentServices.studentQuizz(String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Quizz Got It", getQuizz);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentCreateCertificate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield (0, getId_1.default)('accessToken', req);
                const { username, courseName, mentorName, courseId } = req.body;
                const data = {
                    studentId: userId,
                    studentName: username,
                    courseName,
                    mentorName,
                    courseId,
                };
                const createCertificate = yield this.studentServices.studentCreateCertificate(data);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Certificate Created", createCertificate);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetAllCertificates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield (0, getId_1.default)('accessToken', req);
                const getCertificates = yield this.studentServices.studentGetAllCertificates(String(userId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Certificates All Got It", getCertificates);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentIsVerified(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield (0, getId_1.default)('accessToken', req);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Student Verified");
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    ///////////////////////////////// WEEK - 3 ////////////////////////////
    studentChatGetMentors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = (0, getId_1.default)("accessToken", req);
                const getMentors = yield this.studentServices.studentChatGetMentors(studentId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Mentors Got It", getMentors);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentCreateRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mentorId } = req.body;
                const studentId = (0, getId_1.default)("accessToken", req);
                const createdRoom = yield this.studentServices.studentCreateRoom(studentId, String(mentorId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Room Created", createdRoom);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentSaveMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message, mentorId } = req.body;
                const studentId = (0, getId_1.default)("accessToken", req);
                const savedMessage = yield this.studentServices.studentSaveMessage(studentId, String(mentorId), String(message));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Message Saved", savedMessage);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mentorId } = req.params;
                const studentId = (0, getId_1.default)("accessToken", req);
                const getMessage = yield this.studentServices.studentGetMessages(studentId, String(mentorId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Message Got It", getMessage);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentDeleteEveryOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { messageId } = req.params;
                const deleteEveryOne = yield this.studentServices.studentDeleteEveryOne(String(messageId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Message deleted foreveryone", deleteEveryOne);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentDeleteForMe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { messageId } = req.params;
                const deleteForMe = yield this.studentServices.studentDeleteForMe(String(messageId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Message deleted me", deleteForMe);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentResetCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mentorId } = req.params;
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const resetCount = yield this.studentServices.studentResetCount(studentId, String(mentorId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Count Reset", resetCount);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    // Notification
    studentCreateNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('noti ', req.body);
                const { username, senderId, receiverId } = req.body;
                const createNotify = yield this.studentServices.studentCreateNotification(String(username), String(senderId), String(receiverId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "notification created", createNotify);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.params;
                const getNotification = yield this.studentServices.studentGetNotifications(String(studentId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "notification got it", getNotification);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetNotificationsCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.params;
                const getCount = yield this.studentServices.studentGetNotificationsCount(String(studentId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "count got it", getCount);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetNotificationsSeen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const markSeen = yield this.studentServices.studentGetNotificationsSeen();
                (0, responseUtil_1.SuccessResponse)(res, 200, "marked seen", markSeen);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentDeleteNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId } = req.params;
                const deleteNotify = yield this.studentServices.studentDeleteNotifications(String(senderId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "notification deleted", deleteNotify);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetMentor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mentorId } = req.params;
                const studentId = yield (0, getId_1.default)("accessToken", req);
                const getMentor = yield this.studentServices.studentGetMentor(studentId, String(mentorId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "mentor got it", getMentor);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetBadges(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const getBadges = yield this.studentServices.studentGetBadges(studentId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Badges Got It", getBadges);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
}
exports.default = StudentController;
