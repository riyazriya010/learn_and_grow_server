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
exports.mentorCourseServices = void 0;
const course_repository_1 = __importDefault(require("../../../repositories/entities/mentorRepositories/course.repository"));
class MentorCourseServices {
    constructor(mentorCourseRepository) {
        this.mentorCourseRepository = mentorCourseRepository;
    }
    mentorAddCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addCourse = yield this.mentorCourseRepository.mentorAddCourse(data);
                return addCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllCourse(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllCourses = yield this.mentorCourseRepository.mentorGetAllCourse(userId, page, limit);
                return getAllCourses;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetCourse(courseId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCourse = yield this.mentorCourseRepository.mentorGetCourse(courseId, mentorId);
                return getCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorEditCourse(courseId, updatedFields) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editCourse = yield this.mentorCourseRepository.mentorEditCourse(courseId, updatedFields);
                return editCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorUnPulishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unPublish = yield this.mentorCourseRepository.mentorUnPulishCourse(courseId);
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
                const publish = yield this.mentorCourseRepository.mentorPublishCourse(courseId);
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
                const filterCourse = yield this.mentorCourseRepository.mentorFilterCourse(page, limit, searchTerm, mentorId);
                return filterCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllCategorise() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllCategories = yield this.mentorCourseRepository.mentorGetAllCategorise();
                return getAllCategories;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorCourseServices;
const mentorCourseRepository = new course_repository_1.default();
exports.mentorCourseServices = new MentorCourseServices(mentorCourseRepository);
