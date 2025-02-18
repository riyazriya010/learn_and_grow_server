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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMentorController = void 0;
const responseUtil_1 = require("../../../utils/responseUtil");
const mentor_services_1 = require("../../../services/business/adminServices/mentor.services");
class AdminMentorController {
    constructor(adminMentorServices) {
        this.adminMentorServices = adminMentorServices;
    }
    adminGetMentors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 4 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    const error = new Error('Invalid Page Or Limit');
                    error.name = 'InvalidPageOrLimit';
                    throw error;
                }
                const response = yield this.adminMentorServices.adminGetMentors(pageNumber, limitNumber);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Mentors Got It Successfully", response);
                return;
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    if (error.name === 'InvalidPageOrLimit') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, 'InvalidPageOrLimit');
                        return;
                    }
                    if (error.name === 'MentorsNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, 'Mentor Not Found');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminBlockMentor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.mentorId;
                const response = yield this.adminMentorServices.adminBlockMentor(String(id));
                if (response) {
                    (0, responseUtil_1.SuccessResponse)(res, 200, "Mentor Blocked Successfully", response);
                    return;
                }
            }
            catch (error) {
                console.log('Mentor Block: ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminUnBlockMentor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.mentorId;
                const response = yield this.adminMentorServices.adminUnBlockMentor(String(id));
                if (response) {
                    (0, responseUtil_1.SuccessResponse)(res, 200, "Mentor UnBlocked Successfully", response);
                    return;
                }
            }
            catch (error) {
                console.log('Mentor UnBlock: ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = AdminMentorController;
exports.adminMentorController = new AdminMentorController(mentor_services_1.adminMentorServices);
