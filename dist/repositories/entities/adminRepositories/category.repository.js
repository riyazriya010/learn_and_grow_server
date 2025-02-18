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
const categroy_model_1 = require("../../../models/categroy.model");
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class AdminCategoryRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            Category: categroy_model_1.CategoryModel
        });
    }
    adminAddCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = yield this.findOne('Category', { categoryName: data });
                if (isExist) {
                    const error = new Error('Category Already Exist');
                    error.name = 'CategoryAlreadyExists';
                    throw error;
                }
                const categoryData = {
                    categoryName: data
                };
                const document = yield this.createData('Category', categoryData);
                const savedCategory = yield document.save();
                return savedCategory;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminEditCategory(categoryName, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = yield this.findOne('Category', {
                    categoryName: categoryName,
                    _id: { $ne: categoryId },
                });
                if (isExist) {
                    const error = new Error("Category Already Exists");
                    error.name = "CategoryAlreadyExists";
                    throw error;
                }
                const updatedCategory = yield this.updateById('Category', categoryId, { $set: { categoryName: categoryName } });
                if (!updatedCategory) {
                    const error = new Error("Category Not Found");
                    error.name = "CategoryNotFoundError";
                    throw error;
                }
                return updatedCategory;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminUnListCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unListedCategory = yield this.updateById('Category', categoryId, { isListed: false });
                return unListedCategory;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminListCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unListedCategory = yield this.updateById('Category', categoryId, { isListed: true });
                return unListedCategory;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminGetAllCategory() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 3) {
            try {
                const skip = (page - 1) * limit;
                const response = yield this.findAll('Category')
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCourses = yield this.findAll('Category').countDocuments();
                if (!response || response.length === 0) {
                    const error = new Error('Category Not Found');
                    error.name = 'CategoryNotFound';
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
}
exports.default = AdminCategoryRepository;
