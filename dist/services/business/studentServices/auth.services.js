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
exports.authServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_repository_1 = __importDefault(require("../../../repositories/entities/studentRepository/auth.repository"));
const mailToken_1 = require("../../../integration/mailToken");
const nodemailer_1 = __importDefault(require("../../../integration/nodemailer"));
const constants_1 = require("../../../utils/constants");
class StudentAuthServices {
    constructor(studentAuthRepository) {
        this.studentAuthRepository = studentAuthRepository;
    }
    studentLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginUser = yield this.studentAuthRepository.studentLogin(email, password);
                return loginUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentSignUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashPassword = yield bcrypt_1.default.hash(data.password, 10);
                data.password = hashPassword;
                const addUser = yield this.studentAuthRepository.studentSignUp(data);
                const token = yield (0, mailToken_1.generateAccessToken)({ id: String(addUser === null || addUser === void 0 ? void 0 : addUser._id), email: String(addUser === null || addUser === void 0 ? void 0 : addUser.email) });
                const portLink = constants_1.STUDENT_PORT_LINK;
                console.log('verify link :::: ', portLink);
                const createdLink = `${portLink}?token=${token}`;
                const mail = new nodemailer_1.default();
                mail.sendVerificationEmail(String(addUser === null || addUser === void 0 ? void 0 : addUser.email), createdLink)
                    .then(info => {
                    console.log('Verification email sent successfully: ');
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
                const addStudent = yield this.studentAuthRepository.studentGoogleSignUp({ email, displayName });
                return addStudent;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logUser = yield this.studentAuthRepository.studentGoogleLogin(email);
                return logUser;
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
                const updatePassword = yield this.studentAuthRepository.studentForgetPassword(email, password);
                return updatePassword;
            }
            catch (error) {
                throw error;
            }
        });
    }
    // async studentVerify(otp: string, email: string): Promise<any | null> {
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
                // const verifyUser = await this.studentAuthRepository.studentVerify(otp, email)
                const verifyUser = yield this.studentAuthRepository.studentVerify(email);
                return verifyUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentProfleUpdate(studentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateUser = yield this.studentAuthRepository.studentProfleUpdate(studentId, data);
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
                const findUser = yield this.studentAuthRepository.studentReVerify(email);
                const token = yield (0, mailToken_1.generateAccessToken)({ id: String(findUser === null || findUser === void 0 ? void 0 : findUser._id), email: email });
                const portLink = constants_1.STUDENT_PORT_LINK;
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
                const checkStudent = yield this.studentAuthRepository.studentCheck(studentId);
                return checkStudent;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addTokens(accessToken, refreshToken, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addToken = yield this.studentAuthRepository.addToken(accessToken, refreshToken, studentId);
                return addToken;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentAuthServices;
const authRepository = new auth_repository_1.default();
exports.authServices = new StudentAuthServices(authRepository);
