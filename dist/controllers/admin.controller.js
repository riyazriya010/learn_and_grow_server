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
                const { page = 1, limit = 4 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    return res
                        .status(400)
                        .send({
                        message: 'Invalid page or limit value',
                        success: false,
                    });
                }
                const response = yield this.adminServices.getUsers(pageNumber, limitNumber);
                return res.status(200).send({
                    message: 'Users Got It Successfully',
                    success: true,
                    result: response
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getMentors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 4 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    return res
                        .status(400)
                        .send({
                        message: 'Invalid page or limit value',
                        success: false,
                    });
                }
                const response = yield this.adminServices.getMentors(pageNumber, limitNumber);
                return res.status(200).send({
                    message: 'Mentors Got It Successfully',
                    success: true,
                    result: response
                });
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
                if (error && error.name === 'CategoryAlreadyExistsError') {
                    return res
                        .status(403)
                        .send({
                        message: 'Already Exist',
                        success: false
                    });
                }
            }
        });
    }
    unListCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.query;
                const response = yield this.adminServices.unListCategory(String(categoryId));
                return res
                    .status(200)
                    .send({
                    message: "Category UnListed",
                    success: true,
                    data: response
                });
            }
            catch (error) {
                return res.status(500).send({
                    message: 'Internal Server Error',
                    success: false,
                });
            }
        });
    }
    listCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.query;
                const response = yield this.adminServices.listCategory(String(categoryId));
                return res
                    .status(200)
                    .send({
                    message: "Category Listed",
                    success: true,
                    data: response
                });
            }
            catch (error) {
                return res.status(500).send({
                    message: 'Internal Server Error',
                    success: false,
                });
            }
        });
    }
    getAllCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 4 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    return res
                        .status(400)
                        .send({
                        message: 'Invalid page or limit value',
                        success: false,
                    });
                }
                const response = yield this.adminServices.getAllCategory(pageNumber, limitNumber);
                return res.status(200).send({
                    message: 'Categories Got It Successfully',
                    success: true,
                    result: response
                });
            }
            catch (error) {
                return res.status(500).send({
                    message: 'Internal Server Error',
                    success: false,
                });
            }
        });
    }
    getAllCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 4 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    return res
                        .status(400)
                        .send({
                        message: 'Invalid page or limit value',
                        success: false,
                    });
                }
                const response = yield this.adminServices.getAllCourse(pageNumber, limitNumber);
                return res.status(200).send({
                    message: 'Courses Got It Successfully',
                    success: true,
                    result: response
                });
            }
            catch (error) {
                return res.status(500).send({
                    message: 'Internal Server Error',
                    success: false,
                });
            }
        });
    }
    unListCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const response = yield this.adminServices.unListCourse(String(courseId));
                return res
                    .status(200)
                    .send({
                    message: 'Course Unlisted',
                    success: true
                });
            }
            catch (error) {
                return res.status(500).send({
                    message: 'Internal Server Error',
                    success: false,
                });
            }
        });
    }
    listCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { courseId } = req.query;
                const response = yield this.adminServices.listCourse(String(courseId));
                return res
                    .status(200)
                    .send({
                    message: 'Course Listed',
                    success: true
                });
            }
            catch (error) {
                return res.status(500).send({
                    message: 'Internal Server Error',
                    success: false,
                });
            }
        });
    }
    getWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 4 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                if (pageNumber < 1 || limitNumber < 1) {
                    const error = new Error('Invalid page or limit value');
                    error.name = 'Invalid page or limit value';
                    throw error;
                }
                // const userId = await getId('accessToken', req)
                const adminId = 'admin';
                const response = yield this.adminServices.getWallet(adminId, pageNumber, limitNumber);
                return res
                    .status(200)
                    .send({
                    message: 'Admin Wallet Got It',
                    success: true,
                    data: response
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AdminController = AdminController;
