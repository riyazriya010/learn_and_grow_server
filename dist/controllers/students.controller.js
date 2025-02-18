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
const userService_1 = __importDefault(require("../services/userService"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mailToken_1 = require("../integration/mailToken");
const jwt_1 = require("../integration/jwt");
const getId_1 = __importDefault(require("../integration/getId"));
class UserController {
    constructor() {
        this.userServices = new userService_1.default();
        this.jwtService = new jwt_1.JwtService();
    }
    //Student SignUp Method  // added
    studentSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, email, phone, password } = req.body;
                const saltRound = 10;
                const hashPassword = yield bcrypt_1.default.hash(password, saltRound);
                password = hashPassword;
                const addStudent = yield this.userServices.studentSignup({ username, email, phone, password });
                if (addStudent && addStudent.role) {
                    const userJwtToken = yield this.jwtService.createToken(addStudent._id, addStudent.role);
                    const userRefreshToken = yield this.jwtService.createRefreshToken(addStudent._id, addStudent.role);
                    return res
                        .status(201)
                        .cookie('accessToken', userJwtToken, {
                        httpOnly: false
                    }).cookie('refreshToken', userRefreshToken, {
                        httpOnly: true
                    })
                        .send({
                        success: true,
                        message: 'Student Added Successfully',
                        user: addStudent
                    });
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'UserAlreadyExit') {
                        return res
                            .status(409)
                            .send({
                            message: 'User Already Exist',
                            success: false
                        });
                    }
                }
            }
        });
    }
    // Student google SignUp Method  // added
    studentGoogleSignIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, displayName } = req.body;
                const addStudent = yield this.userServices.studentGoogleSignIn(email, displayName);
                if (addStudent && addStudent.role) {
                    const userJwtToken = yield this.jwtService.createToken(addStudent._id, addStudent.role);
                    const userRefreshToken = yield this.jwtService.createRefreshToken(addStudent._id, addStudent.role);
                    return res
                        .status(201)
                        .cookie('accessToken', userJwtToken, {
                        httpOnly: false
                    }).cookie('refreshToken', userRefreshToken, {
                        httpOnly: true
                    })
                        .send({
                        success: true,
                        message: 'Google Account Added Successfully',
                        user: addStudent
                    });
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'UserAlreadyExit') {
                        return res
                            .status(409)
                            .send({
                            message: 'User Already Exist',
                            success: false
                        });
                    }
                }
            }
        });
    }
    // Student Google Login Method  //added
    studentGoogleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const addStudent = yield this.userServices.studentGoogleLogin(email);
                if (addStudent && addStudent.role) {
                    const userJwtToken = yield this.jwtService.createToken(addStudent._id, addStudent.role);
                    const userRefreshToken = yield this.jwtService.createRefreshToken(addStudent._id, addStudent.role);
                    return res
                        .status(201)
                        .cookie('accessToken', userJwtToken, {
                        httpOnly: false
                    }).cookie('refreshToken', userRefreshToken, {
                        httpOnly: true
                    })
                        .send({
                        success: true,
                        message: 'Google Account Added Successfully',
                        user: addStudent
                    });
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'UserNotFound') {
                        return res
                            .status(403)
                            .send({
                            message: 'User Not Found'
                        });
                    }
                    if (error.name === 'UserBlocked') {
                        return res
                            .status(403)
                            .send({
                            message: 'User Blocked'
                        });
                    }
                }
                throw error;
            }
        });
    }
    // Student Login  // added
    studentLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const loggedUser = yield this.userServices.studentLogin(email, password);
                if (loggedUser === null) {
                    return res.status(401).send({ message: 'Invalid Credentials', success: false });
                }
                const isBlocked = loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.isBlocked;
                if (isBlocked) {
                    return res.status(403).send({
                        message: 'Student  Account Blocked',
                        success: false
                    });
                }
                const userJwtToken = yield this.jwtService.createToken(loggedUser._id, String(loggedUser.role));
                const userRefreshToken = yield this.jwtService.createRefreshToken(loggedUser._id, String(loggedUser.role));
                return res
                    .status(200)
                    .cookie('accessToken', userJwtToken, {
                    httpOnly: false
                }).cookie('refreshToken', userRefreshToken, {
                    httpOnly: true
                })
                    .send({
                    success: true,
                    message: 'User Logged Successfully',
                    user: loggedUser
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    verifyStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.query.token;
                // Verify the token
                const verifiedToken = yield (0, mailToken_1.verifyToken)(token);
                console.log('Verified token:', verifiedToken);
                if (!verifiedToken.status) {
                    console.log('token expired');
                    // throw new Error(verifiedToken.message || 'Token verification failed');
                    return res.status(401).send({
                        message: 'Token Expired',
                        status: false
                    });
                }
                const payload = verifiedToken.payload;
                // Ensure payload is valid
                if (!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)) {
                    throw new Error('Invalid token payload');
                }
                const { email } = payload;
                // Verify user using the email
                const response = yield this.userServices.verifyUser(email);
                if (!response) {
                    throw new Error('User not found or verification failed');
                }
                return res.status(201).send({ success: true, message: 'User verified successfully' });
            }
            catch (error) {
                console.log("Verify Token Error:", error);
                if (error.message === "Verification Token Expired") {
                    return res.status(401).send({
                        message: "Token Expired Please Goto Profile To Verify",
                        status: false,
                    });
                }
                return res.status(500).send({
                    message: "Internal server error",
                    status: false,
                });
            }
        });
    }
    forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const response = yield this.userServices.forgetPassword(data);
                if (!response) {
                    return res
                        .status(401)
                        .send({
                        message: 'Invalid Email',
                        success: true
                    });
                }
                return res
                    .status(200)
                    .send({
                    message: 'Password Updated',
                    success: true,
                    user: response
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    checkStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.userId;
                const response = yield this.userServices.checkStudent(String(id));
                // if(response){
                //     const isBlocked = await this.userServices.isUserBlocked(String(response.email))
                //     if(isBlocked){
                //         return res.status(403).send({
                //             message: 'User is Blocked',
                //             success: true
                //         })
                //     }
                // }
                return res.status(200).send({
                    message: 'User Got It',
                    success: true,
                    user: response
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    studentReVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.query.email;
                const response = yield this.userServices.studentReVerify(String(email));
                return res.status(200).send({
                    message: 'Verification Mail sent Successfully',
                    success: true,
                    user: response
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    profileUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('file: ', req.file);
                const file = req.file;
                const { username, phone } = req.body;
                const data = {
                    username,
                    phone,
                    profilePicUrl: file === null || file === void 0 ? void 0 : file.location
                };
                const userId = yield (0, getId_1.default)('accessToken', req);
                const response = yield this.userServices.profileUpdate(String(userId), data);
                if (response) {
                    return res.status(201).send({
                        message: 'User Updated',
                        success: true,
                        user: response
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*----------------------------------------- WEEK -2 ----------------------------*/
    getAllCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 6 } = req.query;
                // Validate page and limit
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    return res.status(400).send({
                        message: 'Invalid page or limit value',
                        success: false
                    });
                }
                // Call the service to get the courses with pagination
                const response = yield this.userServices.getAllCourses(pageNumber, limitNumber);
                return res.status(200).send({
                    message: 'Courses Fetched Successfully',
                    success: true,
                    result: response
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'CoursesNotFound') {
                        return res.status(404).send({
                            message: 'Courses Not Found',
                            success: false
                        });
                    }
                }
                return res.status(500).send({
                    message: 'Internal Server Error',
                    success: false
                });
            }
        });
    }
    getCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const courseId = req.query.courseId;
                const userId = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.userId;
                if (!courseId) {
                    return res
                        .status(400)
                        .send({
                        message: 'CourseId ID is required in the query parameters.',
                        success: false
                    });
                }
                const response = yield this.userServices.getCourse(String(courseId), String(userId));
                return res
                    .status(200)
                    .send({
                    message: 'Course Got It',
                    success: true,
                    data: response
                });
            }
            catch (error) {
                console.log(error);
                if (error.name === 'Course Not Found') {
                    return res
                        .status(404)
                        .send({
                        message: 'Course Not Found',
                        success: false
                    });
                }
            }
        });
    }
    getCoursePlay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.query.courseId;
                if (!courseId) {
                    return res
                        .status(400)
                        .send({
                        message: 'Course ID is required in the query parameters.',
                        success: false
                    });
                }
                const response = yield this.userServices.getCoursePlay(String(courseId));
                return res
                    .status(200)
                    .send({
                    message: 'Course Got It to paly',
                    success: true,
                    data: response
                });
            }
            catch (error) {
                console.log(error);
                if (error.name === 'CoursesNotFound') {
                    return res
                        .status(404)
                        .send({
                        message: 'Course Not Found',
                        success: false
                    });
                }
            }
        });
    }
    filterData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 6 } = req.query;
                const { selectedCategory, selectedLevel, searchTerm } = req.query;
                // Validate page and limit
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    return res
                        .status(400)
                        .send({
                        message: 'Invalid page or limit value',
                        success: false
                    });
                }
                const response = yield this.userServices.filterData(pageNumber, limitNumber, String(selectedCategory), String(selectedLevel), String(searchTerm));
                return res.status(200).send({
                    message: 'Courses Filtered Successfully',
                    success: true,
                    data: response
                });
            }
            catch (error) {
                if (error && error.name === 'CourseNotFound') {
                    return res
                        .status(404)
                        .send({
                        message: 'Course Not Found',
                        success: false
                    });
                }
                throw error;
            }
        });
    }
    buyCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const courseId = req.query.courseId
                // const txnid = req.query.txnid
                // const amount = req.query.amount
                // const courseName = req.query.courseName
                const { courseId, txnid, amount, courseName } = req.body;
                const isCourseExist = yield this.userServices.findCourseById(String(courseId), Number(amount), String(courseName));
                if (isCourseExist) {
                    const chapters = yield this.userServices.findChaptersById(String(courseId));
                    if (chapters.length !== 0) {
                        const completedChapters = chapters.map((chapter) => ({
                            chapterId: chapter._id,
                            isCompleted: false,
                        }));
                        const userId = yield (0, getId_1.default)('accessToken', req);
                        const response = yield this.userServices.buyCourse(String(userId), String(isCourseExist._id), completedChapters, String(txnid));
                        return res
                            .status(200)
                            .send({
                            message: 'Course Buyed Successfully',
                            success: true,
                            data: response
                        });
                    }
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    isVerified(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield (0, getId_1.default)('accessToken', req);
                return res
                    .status(200)
                    .send({
                    message: 'Succes Verified',
                    success: true
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getBuyedCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Parse query parameters
                const { page = 1, limit = 4 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    const error = new Error('Invalid page or limit value');
                    error.name = 'Invalid page or limit value';
                    throw error;
                }
                // Get user ID (hardcoded for now, replace with token-based logic later)
                const userId = yield (0, getId_1.default)('accessToken', req);
                // Fetch buyed courses using the repository function
                const response = yield this.userServices.getBuyedCourses(String(userId), pageNumber, limitNumber);
                // Format the response
                const formattedResponse = response.courses.map((course) => ({
                    _id: course._id,
                    courseDetails: {
                        courseName: course.courseId.courseName,
                        level: course.courseId.level,
                    },
                    completedChapters: course.completedChapters,
                    isCourseCompleted: course.isCourseCompleted,
                    purchasedAt: course.purchasedAt,
                }));
                // Update the courses in the response object
                response.courses = formattedResponse;
                // Send the response
                return res.status(200).send({
                    message: "Buyed Courses Got Successfully",
                    success: true,
                    data: response,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'Invalid page or limit value') {
                        return res.status(400).send({
                            message: "Invalid page or limit value",
                            success: false,
                        });
                    }
                }
                throw error;
            }
        });
    }
    coursePlay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { buyedId } = req.query;
                const getCourse = yield this.userServices.coursePlay(String(buyedId));
                return res
                    .status(200)
                    .send({
                    message: 'Course Got it to play',
                    success: true,
                    data: getCourse
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    chapterVideoEnd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chapterId } = req.query;
                if (!chapterId) {
                    const error = new Error("ChapterId is not provided in the query");
                    error.name = "MissingChapterIdError";
                    throw error;
                }
                const response = yield this.userServices.chapterVideoEnd(String(chapterId));
                return res
                    .status(200)
                    .send({
                    message: 'Chapter Marked As Completed',
                    succes: true,
                    data: response
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === "MissingChapterIdError") {
                        return res.status(400).send({
                            message: error.message,
                            success: false,
                        });
                    }
                }
                throw error;
            }
        });
    }
    getCertificate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { certificateId } = req.query;
                if (!certificateId) {
                    const error = new Error("certificateId is not provided in the query");
                    error.name = "MissingCertificateIdError";
                    throw error;
                }
                const response = yield this.userServices.getCertificate(String(certificateId));
                return res
                    .status(200)
                    .send({
                    message: 'Certificate Got It',
                    success: true,
                    data: response
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === "MissingCertificateIdError") {
                        return res.status(400).send({
                            message: error.message,
                            success: false,
                        });
                    }
                }
                throw error;
            }
        });
    }
    getQuizz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                if (!courseId) {
                    const error = new Error("courseId is not provided in the query");
                    error.name = "MissingCourseIdError";
                    throw error;
                }
                const response = yield this.userServices.getQuizz(String(courseId));
                return res
                    .status(200)
                    .send({
                    message: 'Quizz got it',
                    success: true,
                    data: response
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === "MissingCertificateIdError") {
                        return res.status(400).send({
                            message: error.message,
                            success: false,
                        });
                    }
                }
                throw error;
            }
        });
    }
    completeCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield (0, getId_1.default)('accessToken', req);
                const { courseId } = req.query;
                const response = yield this.userServices.completeCourse(String(userId), String(courseId));
                if (response === 'Course Already Completed') {
                    return res
                        .status(200)
                        .send({
                        message: 'Course Already Completed',
                        success: true
                    });
                }
                return res
                    .status(200)
                    .send({
                    message: 'Course Completed Successfully',
                    success: true,
                    data: response
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    createCertificate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield (0, getId_1.default)('accessToken', req);
                if (!userId) {
                    return res.status(401).send({
                        message: 'Unauthorized: User ID not found',
                        success: false,
                    });
                }
                const { username, courseName, mentorName, courseId } = req.body;
                // Validate required fields
                if (!username || !courseName || !mentorName || !courseId) {
                    const error = new Error('All fields are required');
                    error.name = 'AllFieldsRequired';
                    throw error;
                }
                const data = {
                    userId,
                    username,
                    courseName,
                    mentorName,
                    courseId,
                };
                // Call service to create certificate
                const response = yield this.userServices.createCertificate(data);
                return res.status(200).send({
                    message: 'Certificate Created Successfully',
                    success: true,
                    data: response,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'AllFieldsRequired') {
                        return res.status(400).send({
                            message: 'All fields are required',
                            success: false,
                        });
                    }
                }
                throw error;
            }
        });
    }
    getCertificates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield (0, getId_1.default)('accessToken', req);
                const response = yield this.userServices.getCertificates(String(userId));
                return res
                    .status(200)
                    .send({
                    message: 'Certificates All Got It',
                    success: true,
                    data: response
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UserController;
