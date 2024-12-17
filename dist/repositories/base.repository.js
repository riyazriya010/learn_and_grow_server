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
const nodemailer_1 = __importDefault(require("../integration/nodemailer"));
const mailToken_1 = require("../integration/mailToken");
const bcrypt_1 = __importDefault(require("bcrypt"));
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
    findByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.model.findOne({ phone: phone });
            return true;
        });
    }
    // signup student
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, phone, password } = userData;
            if (!username || !email || !phone || !password) {
                throw new Error("Missing required fields");
            }
            const modifiedData = {
                username,
                email,
                phone,
                password,
                role: "user",
                studiedHours: 0,
            };
            const document = new this.model(modifiedData);
            const savedUser = yield document.save();
            //mail sending
            const mail = new nodemailer_1.default();
            const token = yield (0, mailToken_1.generateAccessToken)({ id: savedUser.id, email: email });
            const portLink = process.env.PORT_LINK;
            if (!portLink) {
                throw new Error('PORT_LINK environment variable is not set');
            }
            const createdLink = `${portLink}?token=${token}`;
            mail.sendVerificationEmail(email, createdLink)
                .then(info => {
                console.log('Verification email sent successfully:', info);
            })
                .catch(error => {
                console.error('Failed to send verification email:', error);
            });
            return savedUser;
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedUser = yield this.model.findByIdAndDelete(id).exec();
            return deletedUser;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne({ email });
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
    googleUser(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = {
                username: displayName,
                email: email,
                phone: 'Not Provided',
                role: "user",
                studiedHours: 0,
                isVerified: true
            };
            const document = new this.model(userData);
            const savedUser = yield document.save();
            return savedUser;
        });
    }
    //new
    signupStudent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, phone, password } = data;
            const modifiedUser = {
                username,
                email,
                phone,
                password,
                role: 'user',
                studiedHours: 0,
            };
            const document = new this.model(modifiedUser);
            const savedUser = yield document.save();
            const mail = new nodemailer_1.default();
            const token = yield (0, mailToken_1.generateAccessToken)({ id: savedUser.id, email: email });
            const portLink = process.env.PORT_LINK;
            if (!portLink) {
                throw new Error('PORT_LINK environment variable is not set');
            }
            const createdLink = `${portLink}?token=${token}`;
            mail.sendVerificationEmail(email, createdLink)
                .then(info => {
                console.log('Verification email sent successfully:', info);
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
                isVerified: true
            };
            const document = new this.model(userData);
            const savedUser = yield document.save();
            return savedUser;
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
}
exports.default = BaseRepository;
