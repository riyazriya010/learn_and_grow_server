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
exports.mentorAuthController = void 0;
const jwt_1 = require("../../../integration/jwt");
const responseUtil_1 = require("../../../utils/responseUtil");
const mailToken_1 = require("../../../integration/mailToken");
const getId_1 = __importDefault(require("../../../integration/getId"));
const auth_services_1 = require("../../../services/business/mentorServices/auth.services");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY || "",
        secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
    },
});
class MentorAuthController {
    constructor(mentorAuthServices) {
        this.mentorAuthServices = mentorAuthServices;
        this.jwtService = new jwt_1.JwtService();
    }
    MentorLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const logUser = yield this.mentorAuthServices.mentorLogin(email, password);
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
                // SuccessResponse(res, 200, "Mentor Logged", logUser, String(accessToken), String(refreshToken))
                // return
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'PasswordInvalid' || error.name === 'EmailNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, "Invalid Credentials");
                        return;
                    }
                    if (error.name === 'MentorBlocked') {
                        (0, responseUtil_1.ErrorResponse)(res, 403, "Mentor Blocked");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, phone, password, expertise, skills } = req.body;
                const addedMentor = yield this.mentorAuthServices.mentorSignUp({
                    username,
                    email,
                    phone,
                    password,
                    expertise,
                    skills
                });
                const accessToken = yield this.jwtService.createToken(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor._id, String(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor.role));
                const refreshToken = yield this.jwtService.createRefreshToken(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor._id, String(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor.role));
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
                    message: 'User Signup Successfully',
                    result: addedMentor
                });
                // SuccessResponse(res, 200, "Mentor Added Successfully", addedMentor, String(accessToken), String(refreshToken))
                // return
            }
            catch (error) {
                console.info('singup error: ', error);
                if (error instanceof Error) {
                    if (error.name === 'MentorExist') {
                        (0, responseUtil_1.ErrorResponse)(res, 409, 'Mentor Already Exists');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGoogleSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, displayName } = req.body;
                const addedMentor = yield this.mentorAuthServices.mentorGoogleSignUp(email, displayName);
                const accessToken = yield this.jwtService.createToken(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor._id, String(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor.role));
                const refreshToken = yield this.jwtService.createRefreshToken(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor._id, String(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor.role));
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
                    result: addedMentor
                });
                // SuccessResponse(res, 200, "Mentor Added SucessFully", addedMentor, String(accessToken), String(refreshToken))
                // return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'MentorExist') {
                        (0, responseUtil_1.ErrorResponse)(res, 409, 'Mentor Already Exists');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGoogleLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const logMentor = yield this.mentorAuthServices.mentorGoogleLogin(email);
                const accessToken = yield this.jwtService.createToken(logMentor === null || logMentor === void 0 ? void 0 : logMentor._id, String(logMentor === null || logMentor === void 0 ? void 0 : logMentor.role));
                const refreshToken = yield this.jwtService.createRefreshToken(logMentor === null || logMentor === void 0 ? void 0 : logMentor._id, String(logMentor === null || logMentor === void 0 ? void 0 : logMentor.role));
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
                    message: 'User Signup Successfully',
                    result: logMentor
                });
                // SuccessResponse(res, 200, "Mentor Logged", logMentor, String(accessToken), String(refreshToken))
                // return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'EmailNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, "Invalid Credentials Please Signup");
                        return;
                    }
                    if (error.name === 'MentorBlocked') {
                        (0, responseUtil_1.ErrorResponse)(res, 403, "Mentor Blocked");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorForgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const updateMentor = yield this.mentorAuthServices.mentorForgetPassword(email, password);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Mentor Password updated", updateMentor);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === "MentorNotFound") {
                        (0, responseUtil_1.ErrorResponse)(res, 404, "Mentor Not Found");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorProfileUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file;
                const { username, phone } = req.body;
                const data = {
                    username,
                    phone,
                    profilePicUrl: file === null || file === void 0 ? void 0 : file.location
                };
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                const updatedProfile = yield this.mentorAuthServices.mentorProfileUpdate(String(mentorId), data);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Mentor Profile Updated", updatedProfile);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorCheck(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.query;
                const checkMentor = yield this.mentorAuthServices.mentorCheck(String(userId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Mentor Got It", checkMentor);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.query.token;
                // Verify the token
                const verifiedToken = yield (0, mailToken_1.verifyToken)(token);
                console.log('Verified token:', verifiedToken);
                if (!verifiedToken.status) {
                    const error = new Error('Token Expired');
                    error.name = 'TokenExpired';
                    throw error;
                }
                const payload = verifiedToken.payload;
                // Ensure payload is valid
                if (!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)) {
                    const error = new Error('Invalid token payload');
                    error.name = 'InvalidTokenPayload';
                    throw error;
                }
                const { email } = payload;
                const verifyUser = yield this.mentorAuthServices.mentorVerify(String(email));
                (0, responseUtil_1.SuccessResponse)(res, 200, "User Verified", verifyUser);
                return;
            }
            catch (error) {
                console.info('mentor verify error: ', error);
                if (error instanceof Error) {
                    if (error.name === 'TokenExpired') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, "Token Expired");
                        return;
                    }
                    if (error.name === 'InvalidTokenPayload') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, 'Invalid token payload');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorReVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.query.email;
                const verifiyed = yield this.mentorAuthServices.mentorReVerify(String(email));
                (0, responseUtil_1.SuccessResponse)(res, 200, "User Verified", verifiyed);
                return;
            }
            catch (error) {
                console.info('mentor verify error: ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
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
exports.default = MentorAuthController;
exports.mentorAuthController = new MentorAuthController(auth_services_1.mentorAuthServices);
