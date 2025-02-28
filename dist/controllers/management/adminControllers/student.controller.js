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
exports.adminStudentController = void 0;
const student_services_1 = require("../../../services/business/adminServices/student.services");
const jwt_1 = require("../../../integration/jwt");
const responseUtil_1 = require("../../../utils/responseUtil");
class AdminStudentController {
    constructor(adminStudentServices) {
        this.adminStudentServices = adminStudentServices;
        this.jwtService = new jwt_1.JwtService();
    }
    adminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
                    const error = new Error('Invalid Credentials');
                    error.name = 'InvalidCredentials';
                    throw error;
                }
                const userJwtToken = yield this.jwtService.createToken(String(email), 'admin');
                const userRefreshToken = yield this.jwtService.createRefreshToken(String(email), 'admin');
                return res
                    .status(200)
                    .cookie('accessToken', userJwtToken, {
                    httpOnly: false,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                }).cookie('refreshToken', userRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    domain: '.learngrow.live'
                })
                    .send({
                    success: true,
                    message: 'Admin Found Successfully',
                });
            }
            catch (error) {
                console.log('Admin Login Error', error);
                if (error instanceof Error) {
                    if (error.name === 'InvalidCredentials') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, "Invalid Credentials");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminGetStudents(req, res) {
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
                const response = yield this.adminStudentServices.adminGetStudents(pageNumber, limitNumber);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Users Got It Successfully", response);
                return;
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    if (error.name === 'InvalidPageOrLimit') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, 'InvalidPageOrLimit');
                        return;
                    }
                    if (error.name === 'UsersNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 404, 'Users Not Found');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminBlockStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.userId;
                const response = yield this.adminStudentServices.adminBlockStudent(String(id));
                if (response) {
                    (0, responseUtil_1.SuccessResponse)(res, 200, "User Blocked Successfully", response);
                    return;
                }
            }
            catch (error) {
                console.log('User Block: ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminUnBlockStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.userId;
                const response = yield this.adminStudentServices.adminUnBlockStudent(String(id));
                if (response) {
                    (0, responseUtil_1.SuccessResponse)(res, 200, "User UnBlocked Successfully", response);
                    return;
                }
            }
            catch (error) {
                console.log('User UnBlock: ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = AdminStudentController;
exports.adminStudentController = new AdminStudentController(student_services_1.adminStudentServices);
