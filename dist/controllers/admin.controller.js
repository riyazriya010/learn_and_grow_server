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
exports.AdminController = void 0;
const adminService_1 = require("../services/adminService");
const jwt_1 = require("../integration/jwt");
class AdminController {
    constructor() {
        this.adminServices = new adminService_1.AdminServices();
        this.jwtService = new jwt_1.JwtService();
    }
    adminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
                    return res.status(409).send({
                        message: 'Invalid Credential',
                        success: false
                    });
                }
                const userJwtToken = yield this.jwtService.createToken(String(email), 'admin');
                const userRefreshToken = yield this.jwtService.createRefreshToken(String(email), 'admin');
                return res
                    .status(200)
                    .cookie('accessToken', userJwtToken, {
                    httpOnly: false
                }).cookie('refreshToken', userRefreshToken, {
                    httpOnly: true
                })
                    .send({
                    success: true,
                    message: 'Admin Found Successfully',
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminServices.getUsers();
                if (response) {
                    return res
                        .status(200)
                        .send({
                        users: response,
                        message: 'Users Got it',
                        success: true
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getMentors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminServices.getMentors();
                if (response) {
                    return res
                        .status(200)
                        .send({
                        mentors: response,
                        message: 'Mentors Got it',
                        success: true
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockMentor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.mentorId;
                const response = yield this.adminServices.blockMentor(String(id));
                if (response) {
                    return res
                        .status(200)
                        .send({
                        mentor: response,
                        message: `${response.username} Mentor Blocked`,
                        success: true
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unBlockMentor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.mentorId;
                const response = yield this.adminServices.unBlockMentor(String(id));
                if (response) {
                    return res
                        .status(200)
                        .send({
                        mentor: response,
                        message: `${response.username} Mentor UnBlocked`,
                        success: true
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.userId;
                const response = yield this.adminServices.blockUser(String(id));
                if (response) {
                    return res
                        .status(200)
                        .send({
                        mentor: response,
                        message: `${response.username} User Blocked`,
                        success: true
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unBlockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.userId;
                const response = yield this.adminServices.unBlockUser(String(id));
                if (response) {
                    return res
                        .status(200)
                        .send({
                        mentor: response,
                        message: `${response.username} User UnBlocked`,
                        success: true
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*-------------------------------------- WEEK - 2 ---------------------------------*/
    addCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryName } = req.body;
                const data = categoryName;
                const response = yield this.adminServices.addCategory(data);
                if (response) {
                    return res
                        .status(200)
                        .send({
                        message: 'Category Added',
                        status: true,
                        data: response
                    });
                }
            }
            catch (error) {
                // console.log(error)
                if (error.name === 'categoryAlreadyExist') {
                    return res
                        .status(403)
                        .send({
                        message: 'Category Already Exist',
                        success: false
                    });
                }
            }
        });
    }
    editCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.query;
                const { categoryName } = req.body;
                console.log('cat id: ', categoryId);
                console.log('cat name: ', categoryName);
                const response = yield this.adminServices.editCategory(categoryName, String(categoryId));
                if (response === 'Already Exist') {
                    return res
                        .status(403)
                        .send({
                        message: 'Category Already Exist',
                        status: false,
                    });
                }
                if (response) {
                    return res
                        .status(200)
                        .send({
                        message: 'Category Edited',
                        status: true,
                        data: response
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminServices.getAllCategory();
                return res
                    .status(200)
                    .send({
                    message: 'All Categories were Got it',
                    success: true,
                    data: response
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.AdminController = AdminController;
