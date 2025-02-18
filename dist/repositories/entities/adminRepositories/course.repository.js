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
const adminWallet_model_1 = require("../../../models/adminWallet.model");
const chapter_model_1 = require("../../../models/chapter.model");
const uploadCourse_model_1 = require("../../../models/uploadCourse.model");
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class AdminCourseRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            Course: uploadCourse_model_1.CourseModel,
            AdminWallet: adminWallet_model_1.AdminWalletModel,
            Chapter: chapter_model_1.ChapterModel
        });
    }
    adminGetAllCourse() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 5) {
            try {
                const skip = (page - 1) * limit;
                const response = yield this.findAll('Course', { isPublished: true })
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCourses = yield this.findAll('Course').countDocuments();
                if (!response || response.length === 0) {
                    const error = new Error('Course Not Found');
                    error.name = 'CoursesNotFound';
                    throw error;
                }
                return {
                    courses: response,
                    currentPage: page,
                    totalPages: Math.ceil(totalCourses / limit),
                    totalCourses: totalCourses
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminUnListCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCourse = yield this.updateById('Course', courseId, { isListed: false });
                const getAllCourse = yield this.findAll('Course');
                return getAllCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminListCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCourse = yield this.updateById('Course', courseId, { isListed: true });
                const getAllCourse = yield this.findAll('Course');
                return getAllCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminNonApprovedCourse(pageNumber, limitNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (pageNumber - 1) * limitNumber;
                const getCourses = yield this.findAll('Course', { approved: false })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limitNumber)
                    .exec();
                const totalCourses = yield this.findAll('Course', { approved: false }).countDocuments();
                return {
                    courses: getCourses,
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalCourses / limitNumber),
                    totalCourses: totalCourses,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminNonApprovedCourseDetails(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkApprove = yield this.findById('Course', courseId);
                if (checkApprove.approved) {
                    return [];
                }
                const getChapters = yield this.findAll('Chapter', { courseId }).exec();
                return getChapters;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminApproveCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const approveCourse = yield this.updateById('Course', courseId, { approved: true });
                return approveCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminGetWallet(adminId_1) {
        return __awaiter(this, arguments, void 0, function* (adminId, pageNumber = 1, limitNumber = 4) {
            try {
                const skip = (pageNumber - 1) * limitNumber;
                const response = yield this.findAll('AdminWallet', { adminId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limitNumber)
                    .select("-__v");
                const totalWallets = yield this.findAll('AdminWallet', { adminId }).countDocuments();
                return {
                    wallets: response, // Renamed to `wallets` for better readability
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalWallets / limitNumber),
                    totalWallets,
                };
            }
            catch (error) {
                // Improved error handling with additional debug info
                console.error("Error in getWallet:", error.message);
                throw error;
            }
        });
    }
}
exports.default = AdminCourseRepository;
