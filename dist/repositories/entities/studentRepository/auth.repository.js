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
const otp_model_1 = require("../../../models/otp.model");
const tokenBlackList_model_1 = __importDefault(require("../../../models/tokenBlackList.model"));
const user_model_1 = __importDefault(require("../../../models/user.model"));
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class StudentAuthRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            UserModel: user_model_1.default,
            Otp: otp_model_1.OTPModel,
            Token: tokenBlackList_model_1.default
        });
    }
    studentLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.findOne('UserModel', { email: email });
                console.log('findUser: ', findUser);
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
                if (findUser.isBlocked) {
                    const error = new Error('Student Blocked');
                    error.name = 'StudentBlocked';
                    throw error;
                }
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
                const { username, email, phone, password } = userData;
                const existUser = yield this.findOne('UserModel', { email: userData.email });
                if (existUser) {
                    const error = new Error('User Already Exist');
                    error.name = 'UserExist';
                    throw error;
                }
                const modifiedUser = {
                    username,
                    email,
                    phone,
                    password,
                    role: 'student',
                    studiedHours: 0,
                };
                const addUser = yield this.createData('UserModel', modifiedUser);
                return addUser;
                // create otp
                // const otp = await generateRandomFourDigitNumber()
                // const otpData = {
                //     email,
                //     otp: String(otp)
                // }
                // const createdOtp = await this.createData('Otp', otpData)
                // const mail = new Mail()
                // mail.sendVerificationEmail(String(email), String(otp))
                //     .then(info => {
                //         console.log('Otp email sent successfully: ');
                //     })
                //     .catch(error => {
                //         console.error('Failed to send Otp email:', error);
                //     });
                // console.log('createdOtp ::: ', createdOtp)
                // return {
                //     addUser,
                //     createdOtp
                // }
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGoogleSignUp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existUser = yield this.findOne('UserModel', { email: userData.email });
                if (existUser) {
                    const error = new Error('User Already Exist');
                    error.name = 'UserExist';
                    throw error;
                }
                const modifiedUser = {
                    username: userData.displayName,
                    email: userData.email,
                    phone: 'Not Provided',
                    studiedHours: 0,
                    password: 'null',
                    role: 'student',
                    isVerified: true
                };
                const addUser = yield this.createData('UserModel', modifiedUser);
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
                const findUser = yield this.findOne('UserModel', { email: email });
                if (!findUser) {
                    const error = new Error('User Not Found');
                    error.name = 'UserNotFound';
                    throw error;
                }
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
                const findUser = yield this.findOne('UserModel', { email: email });
                if (!findUser) {
                    const error = new Error('User Not Found');
                    error.name = 'UserNotFound';
                    throw error;
                }
                findUser.password = password;
                yield findUser.save();
                return findUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('verify otp: ', otp, 'verify email :', email)
                // const verifyOtp = await this.findOne('Otp', { email, otp })
                // if (!verifyOtp) {
                //     const error = new Error('Otp Not Found')
                //     error.name = 'OtpNotFound'
                //     throw error
                // }
                // const findUser = await this.findOne('UserModel', { email: email })
                // if (!findUser) {
                //     const error = new Error('User Not Found')
                //     error.name = 'UserNotFound'
                //     throw error
                // }
                // findUser.isVerified = true
                // await findUser.save()
                // return verifyOtp
                const findUser = yield this.findOne('UserModel', { email: email });
                if (!findUser) {
                    const error = new Error('User Not Found');
                    error.name = 'UserNotFound';
                    throw error;
                }
                findUser.isVerified = true;
                yield findUser.save();
                return findUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentProfleUpdate(studentId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const updateUser = await this.findByIdAndUpdate(studentId, userData)
                const updateUser = yield this.updateById('UserModel', studentId, userData);
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
                const findUser = yield this.findOne('UserModel', { email: email });
                if (!findUser) {
                    const error = new Error('User Not Found');
                    error.name = 'UserNotFound';
                    throw error;
                }
                // create otp
                // const otp = await generateRandomFourDigitNumber()
                // const otpData = {
                //     email,
                //     otp: String(otp)
                // }
                // const createdOtp = await this.createData('Otp', otpData)
                // const mail = new Mail()
                // mail.sendVerificationEmail(String(email), String(otp))
                //     .then(info => {
                //         console.log('Otp email sent successfully: ');
                //     })
                //     .catch(error => {
                //         console.error('Failed to send Otp email:', error);
                //     });
                // console.log('createdOtp ::: ', createdOtp)
                // return {
                //     findUser,
                //     createdOtp
                // }
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
                // const findUser = await this.findById(studentId)
                const findUser = yield this.findById('UserModel', studentId);
                return findUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addToken(accessToken, refreshToken, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingAccess = yield this.findOne('Token', { token: accessToken });
                if (!existingAccess) {
                    yield this.createData('Token', { token: accessToken });
                }
                const existingRefresh = yield this.findOne('Token', { token: refreshToken });
                if (!existingRefresh) {
                    yield this.createData('Token', { token: refreshToken });
                }
                //Updating version
                const findUser = yield this.findById('UserModel', studentId);
                if (!findUser) {
                    throw new Error('User not found');
                }
                const newVersion = (Number(findUser.version) + 1).toString();
                yield this.updateById('UserModel', studentId, { version: newVersion });
                return { access: accessToken, refresh: refreshToken };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentAuthRepository;
