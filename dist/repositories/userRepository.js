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
// import User, { IUser } from "../models/user.model";
const userBase_repository_1 = __importDefault(require("./baseRepo/userBase.repository"));
const user_model_1 = __importDefault(require("../models/user.model"));
class UserRepositories {
    constructor() {
        this.baseRepository = new userBase_repository_1.default(user_model_1.default);
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.baseRepository.findUsers();
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.createUser(data);
            return response;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.findByEmail(email);
            return response;
        });
    }
    verifyUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.verifyUser(email);
            return response;
        });
    }
    googleUser(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.googleUser(email, displayName);
            return response;
        });
    }
    // new
    studentSignup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const addedUser = yield this.baseRepository.signupStudent(data);
            return addedUser;
        });
    }
    studentGoogleSignIn(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            const addedUser = yield this.baseRepository.studentGoogleSignIn(email, displayName);
            return addedUser;
        });
    }
    studentLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUser = yield this.baseRepository.studentLogin(email, password);
            return loggedUser;
        });
    }
}
exports.default = UserRepositories;
