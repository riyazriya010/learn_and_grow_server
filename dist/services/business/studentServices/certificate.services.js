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
exports.certificateServices = void 0;
const certificate_repository_1 = __importDefault(require("../../../repositories/entities/studentRepository/certificate.repository"));
class StudentCertificateServices {
    constructor(studentCertificateRepository) {
        this.studentCertificateRepository = studentCertificateRepository;
    }
    studentGeCerfiticate(certificateId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCertificate = yield this.studentCertificateRepository.studentGeCerfiticate(certificateId, studentId);
                return getCertificate;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCreateCertificate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createCertificate = yield this.studentCertificateRepository.studentCreateCertificate(data);
                return createCertificate;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetAllCertificates(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCertificates = yield this.studentCertificateRepository.studentGetAllCertificates(studentId);
                return getCertificates;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentCertificateServices;
const certificateRepository = new certificate_repository_1.default();
exports.certificateServices = new StudentCertificateServices(certificateRepository);
