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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import UserRepositories from '../repositories/userRepository';
// import { MentorRepository } from '../repositories/mentorRepository';
const user_model_1 = __importDefault(require("../models/user.model"));
const mentor_model_1 = __importDefault(require("../models/mentor.model"));
// const userRepository = new UserRepositories()
// const mentorRepository = new MentorRepository()
const isUserVerified = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies['accessToken'];
        const decodedToken = jsonwebtoken_1.default.decode(token);
        const { user, role } = decodedToken;
        console.log('decodedToken: ', decodedToken);
        if (role === 'student') {
            console.log('enter1');
            const findUser = yield user_model_1.default.findById(user);
            const isStudentVerify = findUser === null || findUser === void 0 ? void 0 : findUser.isVerified;
            // const isStudentVerify = await userRepository.isVerified(user)
            if (!isStudentVerify) {
                console.log('enter2');
                return res
                    .status(401).send({
                    message: 'Student Not Verified',
                    success: true
                });
            }
        }
        else if (role === 'mentor') {
            const findUser = yield mentor_model_1.default.findById(user);
            const isMentorVerify = findUser === null || findUser === void 0 ? void 0 : findUser.isVerified;
            // const isMentorVerify = await mentorRepository.isVerified(user)
            if (!isMentorVerify) {
                return res
                    .status(401).send({
                    message: 'Mentor Not Verified',
                    success: true
                });
            }
        }
        next();
    }
    catch (error) {
        console.log('Verify User checking error');
    }
});
exports.default = isUserVerified;
