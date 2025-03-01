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
exports.studentAuthController = void 0;
const jwt_1 = require("../../../integration/jwt");
const auth_services_1 = require("../../../services/business/studentServices/auth.services");
const getId_1 = __importDefault(require("../../../integration/getId"));
const responseUtil_1 = require("../../../utils/responseUtil");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY || "",
        secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
    },
});
class StudentAuthController {
    constructor(studentAuthServices) {
        this.studentAuthServices = studentAuthServices;
        this.jwtService = new jwt_1.JwtService();
    }
    studentLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const loginUser = yield this.studentAuthServices.studentLogin(email, password);
                const accessToken = yield this.jwtService.createToken(loginUser === null || loginUser === void 0 ? void 0 : loginUser._id, String(loginUser === null || loginUser === void 0 ? void 0 : loginUser.role));
                const refreshToken = yield this.jwtService.createRefreshToken(loginUser === null || loginUser === void 0 ? void 0 : loginUser._id, String(loginUser === null || loginUser === void 0 ? void 0 : loginUser.role));
                return res
                    .status(200)
                    .cookie('accessToken', accessToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                })
                    .send({
                    success: true,
                    message: 'User Logged Successfully',
                    result: loginUser,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                });
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
                const addUser = yield this.studentAuthServices.studentSignUp({ email, username, phone, password });
                // const { addUser, createdOtp } = userData
                const accessToken = yield this.jwtService.createToken(addUser === null || addUser === void 0 ? void 0 : addUser._id, String(addUser === null || addUser === void 0 ? void 0 : addUser.role));
                const refreshToken = yield this.jwtService.createRefreshToken(addUser === null || addUser === void 0 ? void 0 : addUser._id, String(addUser === null || addUser === void 0 ? void 0 : addUser.role));
                return res
                    .status(200)
                    .cookie('accessToken', accessToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                })
                    .send({
                    success: true,
                    message: 'User signup Successfully',
                    result: addUser
                });
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
                const addStudent = yield this.studentAuthServices.studentGoogleSignUp(email, displayName);
                const accessToken = yield this.jwtService.createToken(addStudent === null || addStudent === void 0 ? void 0 : addStudent._id, String(addStudent === null || addStudent === void 0 ? void 0 : addStudent.role));
                const refreshToken = yield this.jwtService.createRefreshToken(addStudent === null || addStudent === void 0 ? void 0 : addStudent._id, String(addStudent === null || addStudent === void 0 ? void 0 : addStudent.role));
                return res
                    .status(200)
                    .cookie('accessToken', accessToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                })
                    .send({
                    success: true,
                    message: 'User Google Signup Successfully',
                    result: addStudent
                });
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
                const logUser = yield this.studentAuthServices.studentGoogleLogin(email);
                const accessToken = yield this.jwtService.createToken(logUser === null || logUser === void 0 ? void 0 : logUser._id, String(logUser === null || logUser === void 0 ? void 0 : logUser.role));
                const refreshToken = yield this.jwtService.createRefreshToken(logUser === null || logUser === void 0 ? void 0 : logUser._id, String(logUser === null || logUser === void 0 ? void 0 : logUser.role));
                return res
                    .status(200)
                    .cookie('accessToken', accessToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                }).cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                })
                    .send({
                    success: true,
                    message: 'User Logged Successfully',
                    result: logUser
                });
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
                const updatePassword = yield this.studentAuthServices.studentForgetPassword(email, password);
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
                // const otp = req.query.otp as string
                // const {otp, email} = req.query
                // const verifySudent = await this.studentAuthServices.studentVerify(String(otp), String(email))
                const verifySudent = yield this.studentAuthServices.studentVerify(token);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Student Verified", verifySudent);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'tokenExpired') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, "Token Expired Please GoTo Profile");
                        return;
                    }
                    if (error.name === 'OtpNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, "Otp Not Found");
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
                const { username, phone, profilePicUrl } = req.body;
                const data = {
                    username,
                    phone,
                };
                // Only add profilePicUrl if it's provided
                if (profilePicUrl) {
                    data.profilePicUrl = profilePicUrl;
                }
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const updateUser = yield this.studentAuthServices.studentProfleUpdate(String(studentId), data);
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
                const verifiedUesr = yield this.studentAuthServices.studentReVerify(String(email));
                const { findUser, createdOtp } = verifiedUesr;
                return res.send({
                    success: true,
                    message: "Student Verify Otp Send",
                    result: findUser,
                    otp: createdOtp
                });
                // SuccessResponse(res, 200, "Student Verified", verifiedUesr)
                // return
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
                const checkStudent = yield this.studentAuthServices.studentCheck(String(studentId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Uesr Got It", checkStudent);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    getSignedUrl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { files } = req.body;
                if (!Array.isArray(files) || files.length === 0) {
                    return res.status(400).json({ message: "No files provided" });
                }
                const urls = yield Promise.all(files.map((file) => __awaiter(this, void 0, void 0, function* () {
                    const fileKey = `courses/${Date.now()}-${file.fileName}`;
                    const command = new client_s3_1.PutObjectCommand({
                        Bucket: process.env.BUCKET_NAME,
                        Key: fileKey,
                        ContentType: file.fileType,
                    });
                    const presignedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 300 });
                    return { fileKey, presignedUrl };
                })));
                res.status(200).json({ urls });
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = req.cookies.accessToken;
                const refreshToken = req.cookies.refreshToken;
                const addToken = yield this.studentAuthServices.addTokens(accessToken, refreshToken);
                console.log('tokens Added ::: ', addToken);
                return res
                    .status(200)
                    .clearCookie("accessToken", {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    domain: ".learngrow.live",
                })
                    .clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: ".learngrow.live",
                })
                    .send({ success: true, message: "Logged out successfully" });
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
}
exports.default = StudentAuthController;
exports.studentAuthController = new StudentAuthController(auth_services_1.authServices);
