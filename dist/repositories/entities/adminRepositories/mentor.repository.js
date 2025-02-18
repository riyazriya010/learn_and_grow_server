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
const mentor_model_1 = __importDefault(require("../../../models/mentor.model"));
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class AdminMentorRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            Mentor: mentor_model_1.default
        });
    }
    adminGetMentors() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 4) {
            try {
                const skip = (page - 1) * limit;
                const response = yield this.findAll('Mentor')
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCourses = yield this.findAll('Mentor').countDocuments();
                if (!response || response.length === 0) {
                    const error = new Error('Mentors Not Found');
                    error.name = 'MentorsNotFound';
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
    adminBlockMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the mentor by ID
                const mentor = yield this.findById('Mentor', id);
                // Check if the mentor exists
                if (!mentor) {
                    throw new Error('Mentor not found');
                }
                const mentorToUpdate = mentor;
                // Update the `isBlocked` field
                mentorToUpdate.isBlocked = true;
                // Save the updated mentor document
                const updatedMentor = yield mentor.save();
                // Return the updated mentor
                return updatedMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminUnBlockMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mentor = yield this.findById('Mentor', id);
                if (!mentor) {
                    throw new Error('Mentor not found');
                }
                const mentorToUpdate = mentor;
                mentorToUpdate.isBlocked = false;
                const updatedMentor = yield mentor.save();
                return updatedMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AdminMentorRepository;
