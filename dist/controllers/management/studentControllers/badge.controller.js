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
exports.studentRewardController = void 0;
const getId_1 = __importDefault(require("../../../integration/getId"));
const badge_services_1 = require("../../../services/business/studentServices/badge.services");
const responseUtil_1 = require("../../../utils/responseUtil");
class StudentRewardController {
    constructor(studentRewardServices) {
        this.studentRewardServices = studentRewardServices;
    }
    studentRewardConvert(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { badgeId } = req.params;
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const convertBadge = yield this.studentRewardServices.studentRewardConvert(badgeId, studentId);
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Badge Converted', convertBadge);
                return;
            }
            catch (error) {
                console.info('convert Badge ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    studentWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const { page = 1, limit = 4 } = req.query;
                const getWallet = yield this.studentRewardServices.studentWallet(studentId, String(page), String(limit));
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Student Wallet Got It', getWallet);
                return;
            }
            catch (error) {
                console.info('convert Badge ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    studentWalletBalance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const getBalance = yield this.studentRewardServices.studentWalletBalance(studentId);
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Student Wallet Balance Got It', getBalance);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    studentwalletBuyCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { price, courseId } = req.body;
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const buyCourse = yield this.studentRewardServices.studentwalletBuyCourse(studentId, price, courseId);
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Course Buyed SuccessFully', buyCourse);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = StudentRewardController;
exports.studentRewardController = new StudentRewardController(badge_services_1.studentRewardServices);
