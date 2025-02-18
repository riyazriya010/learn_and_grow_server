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
exports.mentorChapterServices = void 0;
const chapter_repository_1 = __importDefault(require("../../../repositories/entities/mentorRepositories/chapter.repository"));
class MentorChapterServices {
    constructor(mentorChapterRepository) {
        this.mentorChapterRepository = mentorChapterRepository;
    }
    mentorAddChapter(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploadChapter = yield this.mentorChapterRepository.mentorAddChapter(data);
                return uploadChapter;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorEditChapter(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editChapter = yield this.mentorChapterRepository.mentorEditChapter(data);
                return editChapter;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllChapters(courseId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getChapters = yield this.mentorChapterRepository.mentorGetAllChapters(courseId, mentorId);
                return getChapters;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorChapterServices;
const mentorChapterRepository = new chapter_repository_1.default();
exports.mentorChapterServices = new MentorChapterServices(mentorChapterRepository);
