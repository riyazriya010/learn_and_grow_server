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
exports.adminSalesController = void 0;
const sales_services_1 = require("../../../services/business/adminServices/sales.services");
const responseUtil_1 = require("../../../utils/responseUtil");
class AdminSalesController {
    constructor(adminSalesServices) {
        this.adminSalesServices = adminSalesServices;
    }
    adminDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getDashboard = yield this.adminSalesServices.adminDashboard();
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Dashboard Details Got It', getDashboard);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminChartGraph(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = req.query.filter ? JSON.parse(req.query.filter) : {};
                const getChart = yield this.adminSalesServices.adminChartGraph(filters);
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Chart Graph Details Got It', getChart);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
    adminSalesReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = req.query.filter ? JSON.parse(req.query.filter) : {};
                const getReport = yield this.adminSalesServices.adminSalesReport(filters);
                (0, responseUtil_1.SuccessResponse)(res, 200, 'Report Details Got It', getReport);
                return;
            }
            catch (error) {
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = AdminSalesController;
exports.adminSalesController = new AdminSalesController(sales_services_1.adminSalesServices);
