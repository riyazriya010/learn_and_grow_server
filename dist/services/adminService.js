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
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.getUsers();
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getMentors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminRepository.getMentors();
                return response;
            }
            catch (error) {
                console.log(error);
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
                console.log(error);
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
                console.log(error);
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
                console.log(error);
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
                console.log(error);
            }
        });
    }
}
exports.AdminServices = AdminServices;
