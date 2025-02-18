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
exports.mentorCourseController = void 0;
const getId_1 = __importDefault(require("../../../integration/getId"));
const course_services_1 = require("../../../services/business/mentorServices/course.services");
const responseUtil_1 = require("../../../utils/responseUtil");
class MentorCourseController {
    constructor(mentorCourseServices) {
        this.mentorCourseServices = mentorCourseServices;
    }
    mentorAddCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('req.body addcourse ', req.body);
                // Map demo videos
                const demoVideo = [{
                        type: 'video',
                        url: req.body.demoVideoUrl,
                    }];
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                // Append processed fields to request body
                req.body.demoVideo = demoVideo;
                req.body.mentorId = String(mentorId);
                const data = req.body;
                const addCourse = yield this.mentorCourseServices.mentorAddCourse(data);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Added Successfully", addCourse);
                // // Extract files
                // const files = req.files as any;
                // const mediaFiles = files?.demoVideo || [];
                // const thumbnailFile = files?.thumbnail ? files.thumbnail[0] : null;
                // // Map demo videos
                // const demoVideo = mediaFiles.map((file: any) => ({
                //     type: 'video',
                //     url: file.location,
                // }));
                // // Extract thumbnail URL
                // const thumbnailUrl = thumbnailFile ? thumbnailFile.location : null;
                // const mentorId = await getId('accessToken', req)
                // // Append processed fields to request body
                // req.body.demoVideo = demoVideo;
                // req.body.thumbnailUrl = thumbnailUrl;
                // req.body.mentorId = String(mentorId)
                // const data = req.body
                // const addCourse = await this.mentorServices.mentorAddCourse(data)
                // SuccessResponse(res, 200, "Course Added Successfully", addCourse)
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'AlreadyExist') {
                        (0, responseUtil_1.ErrorResponse)(res, 403, "Course Already Exist");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetAllCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 4 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                const userId = yield (0, getId_1.default)('accessToken', req);
                const getAllCourse = yield this.mentorCourseServices.mentorGetAllCourse(String(userId), pageNumber, limitNumber);
                (0, responseUtil_1.SuccessResponse)(res, 200, "All Courses Got It", getAllCourse);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'CoursesNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, 'Courses Not Found');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                const getCourse = yield this.mentorCourseServices.mentorGetCourse(String(courseId), mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Got It", getCourse);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorEditCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.query.courseId;
                const updatedFields = {
                    courseName: req.body.courseName,
                    description: req.body.description,
                    category: req.body.category,
                    level: req.body.level,
                    duration: req.body.duration,
                    price: req.body.price,
                };
                // Extract files if they exist (thumbnail and demo video)
                const files = req.files;
                const mediaFiles = (files === null || files === void 0 ? void 0 : files.demoVideo) || [];
                const thumbnailFile = (files === null || files === void 0 ? void 0 : files.thumbnail) ? files.thumbnail[0] : null;
                // Only update demo video if a new file is uploaded
                if (mediaFiles.length > 0) {
                    const demoVideo = mediaFiles.map((file) => ({
                        type: 'video',
                        url: file.location,
                    }));
                    updatedFields.demoVideo = demoVideo;
                }
                // Only update thumbnail if a new file is uploaded
                if (thumbnailFile) {
                    updatedFields.thumbnailUrl = thumbnailFile.location;
                }
                const editedCourse = yield this.mentorCourseServices.mentorEditCourse(String(courseId), updatedFields);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Edited", editedCourse);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'AlreadyExist') {
                        (0, responseUtil_1.ErrorResponse)(res, 403, "Already Exist");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorUnPulishCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const unPublish = yield this.mentorCourseServices.mentorUnPulishCourse(String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Unpublished", unPublish);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorPublishCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const publish = yield this.mentorCourseServices.mentorPublishCourse(String(courseId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Course Published", publish);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorFilterCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 6 } = req.query;
                const { searchTerm } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                const mentorId = yield (0, getId_1.default)('accessToke', req);
                const filterCourse = yield this.mentorCourseServices.mentorFilterCourse(pageNumber, limitNumber, String(searchTerm), mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Filtered Course", filterCourse);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'CourseNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, "Course Not Found");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetAllCategorise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllCategories = yield this.mentorCourseServices.mentorGetAllCategorise();
                (0, responseUtil_1.SuccessResponse)(res, 200, "Categories Got It", getAllCategories);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = MentorCourseController;
exports.mentorCourseController = new MentorCourseController(course_services_1.mentorCourseServices);
