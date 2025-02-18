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
exports.adminBadgeController = void 0;
const badge_services_1 = require("../../../services/business/adminServices/badge.services");
const responseUtil_1 = require("../../../utils/responseUtil");
class AdminBadgeController {
    constructor(adminBadgeServices) {
        this.adminBadgeServices = adminBadgeServices;
    }
    adminAddBadge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { badgeName, description, value } = req.body;
                const data = {
                    badgeName,
                    description,
                    value
                };
                const savedBadge = yield this.adminBadgeServices.adminAddBadge(data);
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Badge Saved', savedBadge);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminGetBadges(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 4 } = req.query;
                const pageNumber = parseInt(page, 10);
                const limitNumber = parseInt(limit, 10);
                const getBadges = yield this.adminBadgeServices.adminGetBadges(pageNumber, limitNumber);
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Badges All Got It', getBadges);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminEditBadge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { badgeId } = req.params;
                const { badgeName, description, value } = req.body;
                const editBadge = yield this.adminBadgeServices.adminEditBadge(badgeId, { badgeName, description, value });
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Badge Saved', editBadge);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = AdminBadgeController;
exports.adminBadgeController = new AdminBadgeController(badge_services_1.adminBadgeServices);
