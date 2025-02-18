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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCourseController = void 0;
const course_services_1 = require("../../../services/business/adminServices/course.services");
const responseUtil_1 = require("../../../utils/responseUtil");
class AdminCourseController {
    constructor(adminCourseServices) {
        this.adminCourseServices = adminCourseServices;
    }
    adminGetAllCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 4 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    const error = new Error('Invalid Page Or Limit');
                    error.name = 'InvalidPageOrLimit';
                    throw error;
                }
                const response = yield this.adminCourseServices.adminGetAllCourse(pageNumber, limitNumber);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Courses Got It Successfully", response);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'InvalidPageOrLimit') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, 'InvalidPageOrLimit');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminUnListCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const response = yield this.adminCourseServices.adminUnListCourse(String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Course Unlisted', response);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminListCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const response = yield this.adminCourseServices.adminListCourse(String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Course Listed', response);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminNonApprovedCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 1 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                const getNotApprovedCourse = yield this.adminCourseServices.adminNonApprovedCourse(pageNumber, limitNumber);
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Not Approved Course Got It', getNotApprovedCourse);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminNonApprovedCourseDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const getDetails = yield this.adminCourseServices.adminNonApprovedCourseDetails(String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Course Details Got It', getDetails);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminApproveCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const approveIt = yield this.adminCourseServices.adminApproveCourse(String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Course Approved', approveIt);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminGetWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 4 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    const error = new Error('Invalid page or limit value');
                    error.name = 'Invalidpageorlimitvalue';
                    throw error;
                }
                // const userId = await getId('accessToken', req)
                const adminId = 'admin';
                const response = yield this.adminCourseServices.adminGetWallet(adminId, pageNumber, limitNumber);
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Course Approved', response);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = AdminCourseController;
exports.adminCourseController = new AdminCourseController(course_services_1.adminCourseServices);
