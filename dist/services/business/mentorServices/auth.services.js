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
exports.mentorAuthServices = void 0;
const mailToken_1 = require("../../../integration/mailToken");
const nodemailer_1 = __importDefault(require("../../../integration/nodemailer"));
const auth_repository_1 = __importDefault(require("../../../repositories/entities/mentorRepositories/auth.repository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../../../utils/constants");
class MentorAuthServices {
    constructor(mentorAuthRepository) {
        this.mentorAuthRepository = mentorAuthRepository;
    }
    mentorLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logUser = yield this.mentorAuthRepository.mentorLogin(email, password);
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
                const addedMentor = yield this.mentorAuthRepository.mentorSignUp(data);
                const token = yield (0, mailToken_1.generateAccessToken)({ id: String(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor._id), email: String(addedMentor === null || addedMentor === void 0 ? void 0 : addedMentor.email) });
                const portLink = constants_1.MENTOR_PORT_LINK;
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
                const addedMentor = yield this.mentorAuthRepository.mentorGoogleSignUp(email, displayName);
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
                const logMentor = yield this.mentorAuthRepository.mentorGoogleLogin(email);
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
                const updatedMentor = yield this.mentorAuthRepository.mentorForgetPassword(email, password);
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
                const updatedProfile = yield this.mentorAuthRepository.mentorProfileUpdate(userId, data);
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
                const checkMentor = yield this.mentorAuthRepository.mentorCheck(userId);
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
                const verifyUser = yield this.mentorAuthRepository.mentorVerify(email);
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
                const verifiedUser = yield this.mentorAuthRepository.mentorReVerify(email);
                const token = yield (0, mailToken_1.generateAccessToken)({ id: String(verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser._id), email: String(verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.email) });
                const portLink = constants_1.MENTOR_PORT_LINK;
                const createdLink = `${portLink}?token=${token}`;
                const mail = new nodemailer_1.default();
                mail.sendVerificationEmail(String(verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.email), createdLink)
                    .then(info => {
                    console.log('Verification email sent successfully:');
                })
                    .catch(error => {
                    console.error('Failed to send verification email:', error);
                });
                return verifiedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorAuthServices;
const mentorAuthRepository = new auth_repository_1.default();
exports.mentorAuthServices = new MentorAuthServices(mentorAuthRepository);
