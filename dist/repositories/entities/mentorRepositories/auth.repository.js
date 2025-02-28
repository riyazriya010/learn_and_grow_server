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
const mentor_model_1 = __importDefault(require("../../../models/mentor.model"));
const authBaseRepository_1 = __importDefault(require("../../baseRepositories/mentorBaseRepositories/authBaseRepository"));
class MentorAuthRepository extends authBaseRepository_1.default {
    constructor() {
        super({
            Mentor: mentor_model_1.default
        });
    }
    mentorLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logUesr = yield this.findOne('Mentor', { email: email });
                return logUesr;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorSignUp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existUser = yield this.findOne('Mentor', { email: userData.email });
                if (existUser) {
                    const error = new Error('Mentor Already Exist');
                    error.name = 'MentorExist';
                    throw error;
                }
                const { username, email, phone, password, expertise, skills } = userData;
                const modifiedUser = {
                    username,
                    email,
                    phone,
                    password,
                    expertise,
                    skills,
                    role: 'mentor',
                };
                const newMentor = yield this.createData('Mentor', modifiedUser);
                yield newMentor.save();
                return newMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGoogleSignUp(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existMentor = yield this.findOne('Mentor', { email });
                if (existMentor) {
                    const error = new Error('Mentor Already Exist');
                    error.name = 'MentorExist';
                    throw error;
                }
                const data = {
                    username: displayName,
                    email,
                    phone: 'Not Provided',
                    expertise: 'Not Provided',
                    skills: 'Not Provided',
                    password: 'null',
                    role: 'mentor',
                    isVerified: true
                };
                const document = yield this.createData('Mentor', data);
                const savedMentor = yield document.save();
                return savedMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logMentor = yield this.findOne('Mentor', { email });
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
                const findMentor = yield this.findOne('Mentor', { email });
                if (!findMentor) {
                    const error = new Error("Mentor Not Found");
                    error.name = "MentorNotFound";
                    throw error;
                }
                findMentor.password = password;
                yield findMentor.save();
                return findMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorProfileUpdate(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mentorData = {
                    username: userData.username,
                    phone: userData.phone,
                };
                if (userData.profilePicUrl) {
                    mentorData.profilePicUrl = userData.profilePicUrl;
                }
                const updatedProfile = yield this.updateById('Mentor', userId, mentorData);
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
                const checkMentor = yield this.findById('Mentor', userId);
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
                const findUser = yield this.findOne('Mentor', { email });
                findUser.isVerified = true;
                const verifiyedUser = yield findUser.save();
                return verifiyedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorReVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.findOne('Mentor', { email });
                // findUser.isVerified = true
                // const verifiyedUser = await findUser.save()
                return findUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorAuthRepository;
