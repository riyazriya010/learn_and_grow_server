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
exports.AdminServices = void 0;
const adminRepository_1 = require("../repositories/adminRepository");
class AdminServices {
    constructor() {
        this.adminRepository = new adminRepository_1.AdminRepository();
    }
    getUsers(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.getUsers(page, limit);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getMentors(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.getMentors(page, limit);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    blockMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.blockMentor(id);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    unBlockMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.unBlockMentor(id);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.blockUser(id);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    unBlockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.unBlockUser(id);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    /*------------------------------------- WEEK - 2 --------------------------*/
    addCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.addCategory(data);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    editCategory(categoryName, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.editCategory(categoryName, categoryId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    unListCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.unListCategory(categoryId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    listCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.listCategory(categoryId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllCategory(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.getAllCategory(page, limit);
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getAllCourse(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.getAllCourse(page, limit);
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    unListCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.unListCourse(courseId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    listCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.listCourse(courseId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.AdminServices = AdminServices;
