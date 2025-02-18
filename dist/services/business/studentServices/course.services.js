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
exports.courseServices = void 0;
const course_repository_1 = __importDefault(require("../../../repositories/entities/studentRepository/course.repository"));
class StudentCourseServices {
    constructor(studentCourseRepository) {
        this.studentCourseRepository = studentCourseRepository;
    }
    studentGetAllCourses(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    const error = new Error('Invalid Page or Limit Value');
                    error.name = 'InvalidPageOrLimit';
                    throw error;
                }
                const getAllCourse = yield this.studentCourseRepository.studentGetAllCourses(pageNumber, limitNumber);
                return getAllCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCourseFilterData(filterData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = parseInt(String(filterData.pageNumber), 10);
                const limitNumber = parseInt(String(filterData.limitNumber), 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    const error = new Error('Invalid Page or Limit Value');
                    error.name = 'InvalidPageOrLimit';
                    throw error;
                }
                const filteredCourse = yield this.studentCourseRepository.studentCourseFilterData({
                    pageNumber,
                    limitNumber,
                    selectedCategory: filterData.selectedCategory,
                    selectedLevel: filterData.selectedLevel,
                    searchTerm: filterData.searchTerm
                });
                return filteredCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetCourse(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCourse = yield this.studentCourseRepository.studentGetCourse(courseId, studentId);
                return findCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetCoursePlay(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCoursePlay = yield this.studentCourseRepository.studentGetCoursePlay(courseId, studentId);
                return getCoursePlay;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentBuyCourse(purchaseData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('buy service');
                const buyCourse = yield this.studentCourseRepository.studentBuyCourse(purchaseData);
                return buyCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentBuyedCourses(studentId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                const buyedCourse = yield this.studentCourseRepository.studentBuyedCourses(studentId, pageNumber, limitNumber);
                if (buyedCourse === null || buyedCourse === void 0 ? void 0 : buyedCourse.courses) {
                    const formattedResponse = (_a = buyedCourse === null || buyedCourse === void 0 ? void 0 : buyedCourse.courses) === null || _a === void 0 ? void 0 : _a.map((course) => ({
                        _id: course._id,
                        courseDetails: {
                            courseName: course.courseId.courseName,
                            level: course.courseId.level,
                        },
                        completedChapters: course.completedChapters,
                        isCourseCompleted: course.isCourseCompleted,
                        purchasedAt: course.purchasedAt,
                    }));
                    buyedCourse.courses = formattedResponse;
                }
                return buyedCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCoursePlay(purchaseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coursePlay = yield this.studentCourseRepository.studentCoursePlay(purchaseId, studentId);
                return coursePlay;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentChapterVideoEnd(chapterId, studiedTime, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCoures = yield this.studentCourseRepository.studentChapterVideoEnd(chapterId, studiedTime, studentId);
                return findCoures;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCompleteCourse(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const completeCourse = yield this.studentCourseRepository.studentCompleteCourse(studentId, courseId);
                return completeCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentQuizz(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getQuizz = yield this.studentCourseRepository.studentQuizz(courseId, studentId);
                return getQuizz;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCheckAlreadyBuyed(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkBuyed = yield this.studentCourseRepository.studentCheckAlreadyBuyed(courseId, studentId);
                return checkBuyed;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentCourseServices;
const courseRepository = new course_repository_1.default();
exports.courseServices = new StudentCourseServices(courseRepository);
