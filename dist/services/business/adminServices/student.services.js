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
exports.adminStudentServices = void 0;
const student_repository_1 = __importDefault(require("../../../repositories/entities/adminRepositories/student.repository"));
class AdminStudentServices {
    constructor(adminStudentRepository) {
        this.adminStudentRepository = adminStudentRepository;
    }
    adminGetStudents(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminStudentRepository.adminGetStudents(page, limit);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminBlockStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminStudentRepository.adminBlockStudent(id);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminUnBlockStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminStudentRepository.adminUnBlockStudent(id);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addTokens(accessToken, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addToken = yield this.adminStudentRepository.addToken(accessToken, refreshToken);
                return addToken;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AdminStudentServices;
const adminStudentRepository = new student_repository_1.default();
exports.adminStudentServices = new AdminStudentServices(adminStudentRepository);
