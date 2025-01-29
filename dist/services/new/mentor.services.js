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
const bcrypt_1 = __importDefault(require("bcrypt"));
class MentorServices {
    constructor(mentorMethods) {
        this.mentorRepository = mentorMethods;
    }
    MentorLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logUser = yield this.mentorRepository.MentorLogin(email, password);
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
}
exports.default = MentorServices;
