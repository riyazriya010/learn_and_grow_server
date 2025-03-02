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
const tokenBlackList_model_1 = __importDefault(require("../../../models/tokenBlackList.model"));
const user_model_1 = __importDefault(require("../../../models/user.model"));
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class AdminStudentRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            User: user_model_1.default,
            Token: tokenBlackList_model_1.default
        });
    }
    adminGetStudents() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 4) {
            try {
                const skip = (page - 1) * limit;
                const response = yield this.findAll('User')
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCourses = yield this.findAll('User').countDocuments();
                if (!response || response.length === 0) {
                    const error = new Error('Users Not Found');
                    error.name = 'UsersNotFound';
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
    adminBlockStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.updateById('User', id, { isBlocked: true });
                if (!updatedUser) {
                    throw new Error('User not found');
                }
                return updatedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminUnBlockStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.updateById('User', id, { isBlocked: false });
                if (!updatedUser) {
                    throw new Error('User not found');
                }
                return updatedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addToken(accessToken, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingAccess = yield this.findOne('Token', { token: accessToken });
                if (!existingAccess) {
                    yield this.createData('Token', { token: accessToken });
                }
                const existingRefresh = yield this.findOne('Token', { token: refreshToken });
                if (!existingRefresh) {
                    yield this.createData('Token', { token: refreshToken });
                }
                return { access: accessToken, refresh: refreshToken };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AdminStudentRepository;
