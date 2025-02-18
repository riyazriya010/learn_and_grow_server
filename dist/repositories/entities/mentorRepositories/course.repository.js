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
const mongoose_1 = __importDefault(require("mongoose"));
const categroy_model_1 = require("../../../models/categroy.model");
const uploadCourse_model_1 = require("../../../models/uploadCourse.model");
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class MentorCourseRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            Category: categroy_model_1.CategoryModel,
            Course: uploadCourse_model_1.CourseModel
        });
    }
    mentorAddCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCategory = yield this.findOne('Category', { categoryName: data.category });
                const mentorId = new mongoose_1.default.Types.ObjectId(String(data === null || data === void 0 ? void 0 : data.mentorId));
                data.mentorId = mentorId;
                data.categoryId = new mongoose_1.default.Types.ObjectId(String(findCategory === null || findCategory === void 0 ? void 0 : findCategory._id));
                const isExist = yield this.findOne('Course', { courseName: data.courseName });
                if (isExist) {
                    const error = new Error('Already Exist');
                    error.name = 'AlreadyExist';
                    throw error;
                }
                const response = yield this.createData('Course', data);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllCourse(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const response = yield this.findAll('Course', { mentorId: userId })
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCourses = yield this.findAll('Course').countDocuments();
                if (!response || response.length === 0) {
                    const error = new Error('Courses Not Found');
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
    mentorGetCourse(courseId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const getCourse = await this.findById('Course', courseId)
                const getCourse = yield this.findOne('Course', { _id: courseId, mentorId });
                if (!getCourse) {
                    // Return default values if no course found
                    return {
                        _id: '',
                        courseName: '',
                        mentorId: '',
                        categoryId: '',
                        description: '',
                        demoVideo: [],
                        price: 0,
                        category: '',
                        level: '',
                        duration: '',
                        thumbnailUrl: '',
                        approved: false,
                        isPublished: false,
                        isListed: false,
                        fullVideo: [],
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        __v: 0
                    }; // Ensure the return type is ICourse
                }
                return getCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorEditCourse(courseId, updatingData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = yield this.findOne('Course', {
                    courseName: updatingData.courseName,
                    _id: { $ne: courseId }
                });
                if (isExist) {
                    const error = new Error('Already Exist');
                    error.name = 'AlreadyExist';
                    throw error;
                }
                const response = yield this.updateById('Course', courseId, updatingData);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorUnPulishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unPublish = yield this.updateById('Course', courseId, { isPublished: false });
                return unPublish;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorPublishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const publish = yield this.updateById('Course', courseId, { isPublished: true });
                return publish;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorFilterCourse(page, limit, searchTerm, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const query = { mentorId };
                if (searchTerm !== 'undefined') {
                    query.courseName = { $regex: searchTerm, $options: 'i' };
                }
                const courses = yield this.findAll('Course', query).skip(skip).limit(limit).sort({ createdAt: -1 });
                const totalCourses = yield this.findAll('Course', query).countDocuments();
                if (!courses || courses.length === 0) {
                    const error = new Error('Course Not Found');
                    error.name = 'CourseNotFound';
                    throw error;
                }
                return {
                    courses,
                    currentPage: page,
                    totalPages: Math.ceil(totalCourses / limit),
                    totalCourses,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllCategorise() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllCategories = yield this.findAll('Category');
                return getAllCategories;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorCourseRepository;
