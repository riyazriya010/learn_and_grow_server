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
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("../../integration/nodemailer"));
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find();
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            // Using lean() to return plain JavaScript objects instead of Mongoose Document
            const foundUser = yield this.model.findOne(query).lean().exec();
            if (!foundUser) {
                return null;
            }
            return foundUser;
        });
    }
    findUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.model.find().exec(); // No .lean() used
            if (!users || users.length === 0) {
                return null;
            }
            return users; // Returns Mongoose documents
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne({ email });
        });
    }
    signupStudent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, phone, password } = data;
            const modifiedUser = {
                username,
                email,
                phone,
                password,
                role: 'student',
                studiedHours: 0,
            };
            const document = new this.model(modifiedUser);
            const savedUser = yield document.save();
            const token = yield (0, mailToken_1.generateAccessToken)({ id: savedUser.id, email: email });
            const portLink = process.env.STUDENT_PORT_LINK;
            if (!portLink) {
                throw new Error('PORT_LINK environment variable is not set');
            }
            const createdLink = `${portLink}?token=${token}`;
            const mail = new nodemailer_1.default();
            mail.sendVerificationEmail(email, createdLink)
                .then(info => {
                console.log('Verification email sent successfully:');
            })
                .catch(error => {
                console.error('Failed to send verification email:', error);
            });
            return savedUser;
        });
    }
    studentGoogleSignIn(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = {
                username: displayName,
                email,
                phone: 'Not Provided',
                studiedHours: 0,
                password: 'null',
                role: 'student',
                isVerified: true
            };
            const document = new this.model(userData);
            const savedUser = yield document.save();
            return savedUser;
        });
    }
    studentGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.model.findOne({ email: email });
            return response;
        });
    }
    studentLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield this.model.findOne({ email: email }).lean().exec();
            if (!getUser) {
                console.log('not get: ', getUser);
                return null;
            }
            console.log('get: ', getUser);
            const isPassword = yield bcrypt_1.default.compare(password, getUser.password);
            if (!isPassword) {
                console.log('is not pass');
                return null;
            }
            console.log('is Pass');
            return getUser;
        });
    }
    createOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    email,
                    otp
                };
                const document = new this.model(data);
                console.log(document);
                const savedOtp = yield document.save();
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.model.findByIdAndDelete(savedOtp._id);
                    console.log('otp deleted ', email);
                }), 60000);
                return savedOtp;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield this.model.findOne({ email: email }).exec();
            if (!findUser) {
                console.error('User not found:', email); // Debug log
                return null;
            }
            console.log('Found user before update:', findUser); // Debug log
            const user = findUser;
            // Update the user verification status
            user.isVerified = true;
            // Save the updated document
            const updatedUser = yield user.save();
            console.log('Updated user after verification:', updatedUser);
            return updatedUser;
        });
    }
    forgetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = data;
                const isUser = yield this.model.findOne({ email: email }).exec();
                if (!isUser) {
                    return null;
                }
                const user = isUser;
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                user.password = hashedPassword;
                console.log('user: ', user);
                const updatedUser = yield user.save();
                console.log('user2');
                return updatedUser;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    checkStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findById(id);
                const user = response;
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    studentReVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.model.findOne({ email: email });
                if (!userData) {
                    return null;
                }
                const token = yield (0, mailToken_1.generateAccessToken)({ id: userData.id, email: email });
                const portLink = process.env.STUDENT_PORT_LINK;
                if (!portLink) {
                    throw new Error('PORT_LINK environment variable is not set');
                }
                const createdLink = `${portLink}?token=${token}`;
                const mail = new nodemailer_1.default();
                mail.sendVerificationEmail(email, createdLink)
                    .then(info => {
                    console.log('Verification email sent successfully:');
                })
                    .catch(error => {
                    console.error('Failed to send verification email:', error);
                });
                return userData;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    isUserBlocked(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findOne({ email: email });
                const user = response;
                if (user.isBlocked) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    profileUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, phone } = data;
                const response = yield this.model.findByIdAndUpdate(id, { username, phone }, { new: true });
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    isBlocked(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findById(id);
                const user = response;
                if (user.isBlocked) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    isVerified(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findById(id);
                const user = response;
                if (user.isVerified) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /* ------------------------------ WEEK - 2 -------------------------*/
    getAllCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.find();
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findById(id);
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = BaseRepository;
