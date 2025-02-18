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
exports.mentorSalesController = void 0;
const getId_1 = __importDefault(require("../../../integration/getId"));
const sales_services_1 = require("../../../services/business/mentorServices/sales.services");
const responseUtil_1 = require("../../../utils/responseUtil");
class MentorSalesController {
    constructor(mentorSalesServices) {
        this.mentorSalesServices = mentorSalesServices;
    }
    mentorDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                const getDashboard = yield this.mentorSalesServices.mentorDashboard(mentorId);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Dashborad data got it", getDashboard);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorChartGraph(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = req.query.filter ? JSON.parse(req.query.filter) : {};
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                const getChart = yield this.mentorSalesServices.mentorChartGraph(mentorId, filters);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Graph Chart data got it", getChart);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    mentorSalesReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = req.query.filter ? JSON.parse(req.query.filter) : {};
                const mentorId = yield (0, getId_1.default)('accessToken', req);
                const getChart = yield this.mentorSalesServices.mentorSalesReport(mentorId, filters);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Sales Report got it", getChart);
                return;
            }
            catch (error) {
                console.info('mentor report: ', error);
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = MentorSalesController;
exports.mentorSalesController = new MentorSalesController(sales_services_1.mentorSalesServices);
