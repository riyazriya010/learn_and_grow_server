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
exports.adminCourseServices = void 0;
const course_repository_1 = __importDefault(require("../../../repositories/entities/adminRepositories/course.repository"));
class AdminCourseServices {
    constructor(adminCourseRepository) {
        this.adminCourseRepository = adminCourseRepository;
    }
    adminGetAllCourse(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminCourseRepository.adminGetAllCourse(page, limit);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminUnListCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminCourseRepository.adminUnListCourse(courseId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminListCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminCourseRepository.adminListCourse(courseId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminNonApprovedCourse(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getNotApprovedCourse = yield this.adminCourseRepository.adminNonApprovedCourse(page, limit);
                return getNotApprovedCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminNonApprovedCourseDetails(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getDetails = yield this.adminCourseRepository.adminNonApprovedCourseDetails(courseId);
                return getDetails;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminApproveCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const approveIt = yield this.adminCourseRepository.adminApproveCourse(courseId);
                return approveIt;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminGetWallet(userId, pageNumber, limitNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminCourseRepository.adminGetWallet(userId, pageNumber, limitNumber);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AdminCourseServices;
const adminCourseRepository = new course_repository_1.default();
exports.adminCourseServices = new AdminCourseServices(adminCourseRepository);
