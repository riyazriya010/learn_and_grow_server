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
const certificate_model_1 = require("../../../models/certificate.model");
const studentBadges_model_1 = require("../../../models/studentBadges.model");
const adminBadge_model_1 = require("../../../models/adminBadge.model");
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class StudentCertificateRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            Certificate: certificate_model_1.CertificateModel,
            BadgeManagement: adminBadge_model_1.BadgeManagementModel,
            Badge: studentBadges_model_1.BadgeModel
        });
    }
    studentGeCerfiticate(certificateId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const findCertificate = await this.findById('Certificate', certificateId)
                const findCertificate = yield this.findOne('Certificate', { _id: certificateId, userId: studentId });
                if (!findCertificate) {
                    return {
                        _id: '',
                        userId: '',
                        courseId: '',
                        courseName: '',
                        mentorName: '',
                        userName: '',
                        issuedDate: '',
                        createdAt: '',
                        updatedAt: '',
                        __v: 0
                    };
                }
                return findCertificate;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCreateCertificate(certificateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId, studentName, courseName, mentorName, courseId } = certificateData;
                const certificteData = {
                    userId: new mongoose_1.default.Types.ObjectId(studentId),
                    userName: studentName,
                    courseName,
                    mentorName,
                    courseId: new mongoose_1.default.Types.ObjectId(courseId)
                };
                const certificate = yield this.createData('Certificate', certificteData);
                const savedCertificate = yield certificate.save();
                //creating badge for student
                const findBadge = yield this.findOne('BadgeManagement', { badgeName: 'Course Completion' });
                const badgeData = {
                    userId: new mongoose_1.default.Types.ObjectId(studentId),
                    badgeId: new mongoose_1.default.Types.ObjectId(String(findBadge === null || findBadge === void 0 ? void 0 : findBadge._id))
                };
                const createBadge = yield this.createData('Badge', badgeData);
                yield createBadge.save();
                return savedCertificate;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetAllCertificates(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCertificates = yield this.findAll('Certificate', { userId: studentId })
                    .sort({ issuedDate: -1 });
                return getCertificates;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentCertificateRepository;
