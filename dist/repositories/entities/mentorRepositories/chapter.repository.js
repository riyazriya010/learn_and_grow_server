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
const chapter_model_1 = require("../../../models/chapter.model");
const uploadCourse_model_1 = require("../../../models/uploadCourse.model");
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class MentorChapterRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            Chapter: chapter_model_1.ChapterModel,
            Course: uploadCourse_model_1.CourseModel
        });
    }
    mentorAddChapter(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newDocument = yield this.createData('Chapter', data);
                const savedChapter = yield newDocument.save();
                yield uploadCourse_model_1.CourseModel.findByIdAndUpdate(data.courseId, {
                    $push: {
                        fullVideo: { chapterId: savedChapter._id },
                    },
                }, { new: true });
                return savedChapter;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorEditChapter(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const datas = {
                    chapterTitle: data.chapterTitle,
                    description: data.description,
                };
                if (data.videoUrl) {
                    datas.videoUrl = data.videoUrl;
                }
                const updatedChapter = yield this.updateById('Chapter', data.chapterId, { $set: datas });
                return updatedChapter;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllChapters(courseId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCourse = yield this.findOne('Course', { _id: courseId, mentorId });
                if (!findCourse) {
                    return [];
                }
                const getChapters = yield this.findAll('Chapter', { courseId });
                return getChapters;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorChapterRepository;
