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
exports.UserServices = void 0;
const userRepository_1 = require("../repositories/userRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserServices {
    constructor() {
        this.userRepository = new userRepository_1.UserRepository();
    }
    signUp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if the email or phone already exists using repository methods
            const existingUserByEmail = yield this.userRepository.findUserByEmail(userData.email);
            const existingUserByPhone = yield this.userRepository.findUserByPhone(userData.phone);
            if (existingUserByEmail) {
                throw new Error('User with this email already exists');
            }
            if (existingUserByPhone) {
                throw new Error('User with this phone number already exists');
            }
            // Hash the password before saving
            const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
            // Create the user object with hashed password
            const newUser = {
                username: userData.username,
                email: userData.email,
                phone: userData.phone,
                password: hashedPassword,
            };
            // Save the user via the repository
            const createdUser = yield this.userRepository.createUser(newUser);
            return createdUser;
        });
    }
}
exports.UserServices = UserServices;
