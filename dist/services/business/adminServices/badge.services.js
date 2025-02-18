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
exports.adminBadgeServices = void 0;
const badge_repository_1 = __importDefault(require("../../../repositories/entities/adminRepositories/badge.repository"));
class AdminBadgeServices {
    constructor(adminBadgeRepository) {
        this.adminBadgeRepository = adminBadgeRepository;
    }
    adminAddBadge(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addBadge = yield this.adminBadgeRepository.adminAddBadge(data);
                return addBadge;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminEditBadge(badgeId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editBadge = yield this.adminBadgeRepository.adminEditBadge(badgeId, data);
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
                const getBadge = yield this.adminBadgeRepository.adminGetBadges(page, limit);
                return getBadge;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AdminBadgeServices;
const adminBadgeRepository = new badge_repository_1.default();
exports.adminBadgeServices = new AdminBadgeServices(adminBadgeRepository);
