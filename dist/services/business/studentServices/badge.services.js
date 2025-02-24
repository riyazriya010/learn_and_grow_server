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
exports.studentRewardServices = void 0;
const reward_repository_1 = __importDefault(require("../../../repositories/entities/studentRepository/reward.repository"));
class StudentRewardServices {
    constructor(studentRewardRepository) {
        this.studentRewardRepository = studentRewardRepository;
    }
    studentRewardConvert(badgeId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const convertBadge = yield this.studentRewardRepository.studentRewardConvert(badgeId, studentId);
                return convertBadge;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentWallet(studentId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                const getWallet = yield this.studentRewardRepository.studentWallet(studentId, pageNumber, limitNumber);
                return getWallet;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentWalletBalance(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getBalance = yield this.studentRewardRepository.studentWalletBalance(studentId);
                return getBalance;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentwalletBuyCourse(studentId, price, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buyCourse = yield this.studentRewardRepository.studentwalletBuyCourse(studentId, price, courseId);
                return buyCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentRewardServices;
const studentRewardRepository = new reward_repository_1.default();
exports.studentRewardServices = new StudentRewardServices(studentRewardRepository);
