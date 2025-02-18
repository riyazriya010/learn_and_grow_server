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
const user_model_1 = __importDefault(require("../../../models/user.model"));
const studentAuthBaseRepository_1 = __importDefault(require("../../baseRepositories/studentBaseRepositories/studentAuthBaseRepository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class StudentAuthRepository extends studentAuthBaseRepository_1.default {
    constructor() {
        super(user_model_1.default);
    }
    studentLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.findByEmail(email);
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
                const existUser = yield this.findByEmail(userData.email);
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
                const addUser = yield this.createStudent(modifiedUser);
                return addUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGoogleSignUp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existUser = yield this.findByEmail(userData.email);
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
                const addUser = yield this.createStudent(modifiedUser);
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
                const findUser = yield this.findByEmail(email);
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
                const findUser = yield this.findByEmail(email);
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
                const findUser = yield this.findByEmail(email);
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
                const updateUser = yield this.findByIdAndUpdate(studentId, userData);
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
                const findUser = yield this.findByEmail(email);
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
    studentCheck(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.findById(studentId);
                return findUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentAuthRepository;
