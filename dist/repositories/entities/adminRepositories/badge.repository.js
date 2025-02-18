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
const adminBadge_model_1 = require("../../../models/adminBadge.model");
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class AdminBadgeRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            Badge: adminBadge_model_1.BadgeManagementModel
        });
    }
    adminAddBadge(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = yield this.findOne('Badge', {
                    badgeName: data.badgeName
                });
                if (isExist) {
                    const error = new Error("Badge Already Exists");
                    error.name = "BadgeAlreadyExists";
                    throw error;
                }
                const addBadge = yield this.createData('Badge', data);
                const savedBadge = yield addBadge.save();
                return savedBadge;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminEditBadge(badgeId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = yield this.findOne('Badge', {
                    badgeName: data.badgeName,
                    _id: { $ne: badgeId },
                });
                if (isExist) {
                    const error = new Error("Badge Already Exists");
                    error.name = "BadgeAlreadyExists";
                    throw error;
                }
                const editBadge = yield this.updateById('Badge', badgeId, { $set: data });
                return editBadge;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminGetBadges(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const response = yield this.findAll('Badge')
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCourses = yield this.findAll('Badge').countDocuments();
                const data = {
                    badges: response,
                    currentPage: page,
                    totalPages: Math.ceil(totalCourses / limit),
                    totalCourses: totalCourses
                };
                return data;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AdminBadgeRepository;
