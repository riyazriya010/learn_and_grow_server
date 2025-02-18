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
exports.studentCertificateController = void 0;
const getId_1 = __importDefault(require("../../../integration/getId"));
const certificate_services_1 = require("../../../services/business/studentServices/certificate.services");
const responseUtil_1 = require("../../../utils/responseUtil");
class StudentCertificateController {
    constructor(studentCertificateServices) {
        this.studentCertificateServices = studentCertificateServices;
    }
    studentGeCerfiticate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { certificateId } = req.query;
                const studentId = yield (0, getId_1.default)('accessToken', req);
                const getCertificate = yield this.studentCertificateServices.studentGeCerfiticate(String(certificateId), studentId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Certificate Got It", getCertificate);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentCreateCertificate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield (0, getId_1.default)('accessToken', req);
                const { username, courseName, mentorName, courseId } = req.body;
                const data = {
                    studentId: userId,
                    studentName: username,
                    courseName,
                    mentorName,
                    courseId,
                };
                const createCertificate = yield this.studentCertificateServices.studentCreateCertificate(data);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Certificate Created", createCertificate);
                return;
            }
            catch (error) {
                console.info('create certificate Error ::: ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
    studentGetAllCertificates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = yield (0, getId_1.default)('accessToken', req);
                const getCertificates = yield this.studentCertificateServices.studentGetAllCertificates(String(userId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Certificates All Got It", getCertificates);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, "Internal Server Error");
                return;
            }
        });
    }
}
exports.default = StudentCertificateController;
exports.studentCertificateController = new StudentCertificateController(certificate_services_1.certificateServices);
