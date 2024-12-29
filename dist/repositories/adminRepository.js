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
exports.AdminRepository = void 0;
const mentor_model_1 = __importDefault(require("../models/mentor.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const adminBase_repository_1 = require("./baseRepo/adminBase.repository");
class AdminRepository {
    constructor() {
        this.userBaseRepository = new adminBase_repository_1.AdminBaseRepository(user_model_1.default);
        this.mentorBaseRepository = new adminBase_repository_1.AdminBaseRepository(mentor_model_1.default);
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userBaseRepository.getUsers();
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getMentors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.mentorBaseRepository.getMentors();
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.mentorBaseRepository.blockMentor(id);
                return response;
            }
            catch (error) {
                console.error('Error in AdminRepository while blocking mentor:', error);
                throw new Error('Failed to block mentor in AdminRepository');
            }
        });
    }
    unBlockMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.mentorBaseRepository.unBlockMentor(id);
                return response;
            }
            catch (error) {
                console.error('Error in AdminRepository while Unblocking mentor:', error);
                throw new Error('Failed to Unblock mentor in AdminRepository');
            }
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userBaseRepository.blockUser(id);
                return response;
            }
            catch (error) {
                console.error('Error in AdminRepository while blocking User:', error);
                throw new Error('Failed to block User in AdminRepository');
            }
        });
    }
    unBlockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userBaseRepository.unBlockUser(id);
                return response;
            }
            catch (error) {
                console.error('Error in AdminRepository while Unblocking User:', error);
                throw new Error('Failed to Unblock User in AdminRepository');
            }
        });
    }
}
exports.AdminRepository = AdminRepository;
