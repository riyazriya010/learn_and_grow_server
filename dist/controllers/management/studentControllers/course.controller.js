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
exports.studentCourseController = void 0;
const getId_1 = __importDefault(require("../../../integration/getId"));
const course_services_1 = require("../../../services/business/studentServices/course.services");
const responseUtil_1 = require("../../../utils/responseUtil");
class StudentCourseController {
    constructor(studentCourseServices) {
        this.studentCourseServices = studentCourseServices;
    }
    studentGetAllCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 6 } = req.query;
                console.log('req.query ', page, limit);
                const getAllCourses = yield this.studentCourseServices.studentGetAllCourses(String(page), String(limit));
                (0, responseUtil_1.SuccessResponse)(res, 200, "All Course Got It", getAllCourses);
                return;
            }
            catch (error) {
                console.log('error on get all course: ', error);
                if (error instanceof Error) {
                    if (error.name === 'CoursesNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, "Courses Not Found");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentCourseFilterData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 6 } = req.query;
                const { selectedCategory, selectedLevel, searchTerm } = req.query;
                const filteredCourse = yield this.studentCourseServices.studentCourseFilterData({
                    pageNumber: Number(page),
                    limitNumber: Number(limit),
                    selectedCategory: String(selectedCategory),
                    selectedLevel: String(selectedLevel),
                    searchTerm: String(searchTerm)
                });
                (0, responseUtil_1.SuccessResponse)(res, 200, "Data Filtered", filteredCourse);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'CourseNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, "Courses Not Found");
                        return;
                    }
                }
                console.info('error ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const courseId = req.query.courseId;
                const studentId = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.userId;
                const getCourse = yield this.studentCourseServices.studentGetCourse(String(courseId), String(studentId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Got It", getCourse);
                return;
            }
            catch (error) {
                console.info('getCourse: ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetCoursePlay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.query.courseId;
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const getCoursePlay = yield this.studentCourseServices.studentGetCoursePlay(String(courseId), studentId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Got It", getCoursePlay);
                return;
            }
            catch (error) {
                console.info('getCoursePlay: ', error);
                if (error instanceof Error) {
                    if (error.name === 'CourseNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, "Course Not Found");
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentBuyCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId, txnid, amount, courseName } = req.body;
                console.log(courseId, txnid, amount, courseId);
                const userId = yield (0, getId_1.default)('accessToken', req);
                const buyCourse = yield this.studentCourseServices.studentBuyCourse({ userId, courseId, txnid, amount });
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Buyed Successfully", buyCourse);
                return;
            }
            catch (error) {
                console.info('payment error ', error);
                if (error instanceof Error) {
                    (0, responseUtil_1.ErrorResponse)(res, 404, "Chapters Not Found");
                    return;
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentBuyedCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('buyedCourse controller ', req.query);
                const { page = 1, limit = 4 } = req.query;
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const buyedCourse = yield this.studentCourseServices.studentBuyedCourses(studentId, String(page), String(limit));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Buyed Courses Got It", buyedCourse);
                return;
            }
            catch (error) {
                console.info('BuyedCourses :', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentCoursePlay(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const purchaseId = req.query.buyedId;
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const coursePlay = yield this.studentCourseServices.studentCoursePlay(String(purchaseId), studentId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Got It For Play", coursePlay);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentChapterVideoEnd(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chapterId, studiedTime } = req.query;
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const findCoures = yield this.studentCourseServices.studentChapterVideoEnd(String(chapterId), String(studiedTime), studentId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Chapter Video Ended", findCoures);
                return;
            }
            catch (error) {
                console.log('chap end ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentIsVerified(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield (0, getId_1.default)('accessToken', req);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Student Verified");
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentCompleteCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const { courseId } = req.query;
                const completeCourse = yield this.studentCourseServices.studentCompleteCourse(String(studentId), String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Corse Completed", completeCourse);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === "CourseAlreadyCompleted") {
                        (0, responseUtil_1.ErrorResponse)(res, 401, "Course Already Completed");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentQuizz(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const getQuizz = yield this.studentCourseServices.studentQuizz(String(courseId), studentId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Quizz Got It", getQuizz);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentCheckAlreadyBuyed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.params;
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const checkBuyed = yield this.studentCourseServices.studentCheckAlreadyBuyed(courseId, studentId);
                if (!checkBuyed) {
                    (0, responseUtil_1.SuccessResponse)(res, 200, 'Not Already Buyed', checkBuyed);
                    return;
                }
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Already Buyed', checkBuyed);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
}
exports.default = StudentCourseController;
exports.studentCourseController = new StudentCourseController(course_services_1.courseServices);
