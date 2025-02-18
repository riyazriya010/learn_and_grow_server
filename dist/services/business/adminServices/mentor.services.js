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
exports.adminMentorServices = void 0;
const mentor_repository_1 = __importDefault(require("../../../repositories/entities/adminRepositories/mentor.repository"));
class AdminMentorServices {
    constructor(adminMentorRepository) {
        this.adminMentorRepository = adminMentorRepository;
    }
    adminGetMentors(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminMentorRepository.adminGetMentors(page, limit);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminBlockMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminMentorRepository.adminBlockMentor(id);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminUnBlockMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminMentorRepository.adminUnBlockMentor(id);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AdminMentorServices;
const adminmentorRepository = new mentor_repository_1.default();
exports.adminMentorServices = new AdminMentorServices(adminmentorRepository);
