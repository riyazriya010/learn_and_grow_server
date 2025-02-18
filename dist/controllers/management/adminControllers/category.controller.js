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
exports.adminCategoryController = void 0;
const category_services_1 = require("../../../services/business/adminServices/category.services");
const responseUtil_1 = require("../../../utils/responseUtil");
class AdminCategoryController {
    constructor(adminCategoryServices) {
        this.adminCategoryServices = adminCategoryServices;
    }
    adminAddCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryName } = req.body;
                const data = categoryName;
                const response = yield this.adminCategoryServices.adminAddCategory(data);
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Category Added', response);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'CategoryAlreadyExists') {
                        (0, responseUtil_1.ErrorResponse)(res, 403, 'Category Already Exists');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminEditCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.query;
                const { categoryName } = req.body;
                const response = yield this.adminCategoryServices.adminEditCategory(categoryName, String(categoryId));
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Category Edited', response);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'CategoryAlreadyExists') {
                        (0, responseUtil_1.ErrorResponse)(res, 403, 'Category Already Exists');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminUnListCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.query;
                const response = yield this.adminCategoryServices.adminUnListCategory(String(categoryId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Category UnListed", response);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminListCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.query;
                const response = yield this.adminCategoryServices.adminListCategory(String(categoryId));
                (0, responseUtil_1.SuccessResponse)(res, 200, "Category Listed", response);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminGetAllCategory(req, res) {
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
                const response = yield this.adminCategoryServices.adminGetAllCategory(pageNumber, limitNumber);
                return res.status(200).send({
                    message: 'Categories Got It Successfully',
                    success: true,
                    result: response
                });
            }
            catch (error) {
                console.log('Category Get Error: ', error);
                if (error instanceof Error) {
                    if (error.name === 'InvalidPageOrLimit') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, 'InvalidPageOrLimit');
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = AdminCategoryController;
exports.adminCategoryController = new AdminCategoryController(category_services_1.adminCategoryServices);
