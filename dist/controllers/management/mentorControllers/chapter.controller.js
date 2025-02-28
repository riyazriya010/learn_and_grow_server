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
exports.mentorChapterController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chapter_services_1 = require("../../../services/business/mentorServices/chapter.services");
const responseUtil_1 = require("../../../utils/responseUtil");
const getId_1 = __importDefault(require("../../../integration/getId"));
class MentorChapterController {
    constructor(mentorChapterServices) {
        this.mentorChapterServices = mentorChapterServices;
    }
    mentorAddChapter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query; // Extract courseId from the query
                const { title, description, videoUrl } = req.body;
                // const file = req.file as any;
                const data = {
                    chapterTitle: title,
                    courseId: new mongoose_1.default.Types.ObjectId(String(courseId)),
                    description,
                    videoUrl: videoUrl,
                    // videoUrl: file.location,
                };
                const uploadChapter = yield this.mentorChapterServices.mentorAddChapter(data);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Chapter Uploaded", uploadChapter);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorEditChapter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chapterId } = req.query;
                const { title, description } = req.body;
                const file = req.file;
                const fileLocation = file === null || file === void 0 ? void 0 : file.location;
                const data = {
                    title,
                    description,
                    chapterId: String(chapterId),
                    fileLocation
                };
                const editChapter = yield this.mentorChapterServices.mentorEditChapter(data);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Chapter Edited", editChapter);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorGetAllChapters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                const getAllChapters = yield this.mentorChapterServices.mentorGetAllChapters(String(courseId), mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Chapters Got It", getAllChapters);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = MentorChapterController;
exports.mentorChapterController = new MentorChapterController(chapter_services_1.mentorChapterServices);
