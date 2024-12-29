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
exports.MentorRepository = void 0;
const mentor_model_1 = __importDefault(require("../models/mentor.model"));
const mentorBase_repository_1 = __importDefault(require("./baseRepo/mentorBase.repository"));
class MentorRepository {
    constructor() {
        this.baseRepository = new mentorBase_repository_1.default(mentor_model_1.default);
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.findByEmail(email);
            return response;
        });
    }
    mentorSignUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.mentorSignUp(data);
            return response;
        });
    }
    mentorLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggedUser = yield this.baseRepository.mentorLogin(email, password);
            return loggedUser;
        });
    }
    forgetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.forgetPassword(data);
            return response;
        });
    }
    mentorGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const addedUser = yield this.baseRepository.mentorGoogleLogin(email);
            return addedUser;
        });
    }
    mentorGoogleSignUp(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            const addedUser = yield this.baseRepository.mentorGoogleSignUp(email, displayName);
            return addedUser;
        });
    }
    profileUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.profileUpdate(id, data);
            return response;
        });
    }
    checkMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.checkStudent(id);
            return response;
        });
    }
    isUserBlocked(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.isUserBlocked(email);
            return response;
        });
    }
    mentorReVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.mentorReVerify(email);
            return response;
        });
    }
    verifyMentor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.verifyMentor(email);
            return response;
        });
    }
    isBlocked(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.isBlocked(id);
            return response;
        });
    }
    isVerified(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.baseRepository.isVerified(id);
            return response;
        });
    }
}
exports.MentorRepository = MentorRepository;
