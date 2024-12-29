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
    // new methods
    //Student SignUp Method
    studentSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { username, email, phone, password } = req.body;
                const saltRound = 10;
                const hashPassword = yield bcrypt_1.default.hash(password, saltRound);
                password = hashPassword;
                const ExistUser = yield this.userServices.findByEmail(email);
                if (ExistUser) {
                    return res.status(409).send({ message: 'User Already Exist', success: false, });
                }
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
                console.error(error);
            }
        });
    }
    // Student google SignUp Method
    studentGoogleSignIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, displayName } = req.body;
                const ExistUser = yield this.userServices.findByEmail(email);
                if (ExistUser) {
                    return res.status(409).send({ message: 'User Already Exist', success: false });
                }
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
                console.error(error.message);
            }
        });
    }
    // Student Google Login Method
    studentGoogleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const addStudent = yield this.userServices.studentGoogleLogin(email);
                if (!addStudent) {
                    return res.status(403).send({
                        message: 'Google User Not Found Please Go to Signup Page',
                        success: false
                    });
                }
                if ((addStudent === null || addStudent === void 0 ? void 0 : addStudent.isBlocked) === true) {
                    return res.status(403).send({
                        message: 'You Are Blocked',
                        success: false
                    });
                }
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
                console.error(error.message);
            }
        });
    }
    // Student Login
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
                const { username, phone } = req.body;
                const data = {
                    username,
                    phone
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
                const response = yield this.userServices.getAllCourses();
                return res
                    .status(200)
                    .send({
                    message: 'Courses Fetched Successfully',
                    success: true,
                    result: response
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.query.courseId;
                const response = yield this.userServices.getCourse(String(courseId));
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
            }
        });
    }
}
exports.default = UserController;
