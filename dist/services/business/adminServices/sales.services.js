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
exports.adminSalesServices = void 0;
const sales_repository_1 = __importDefault(require("../../../repositories/entities/adminRepositories/sales.repository"));
class AdminSalesServices {
    constructor(adminSalesRepository) {
        this.adminSalesRepository = adminSalesRepository;
    }
    adminDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getDashboard = yield this.adminSalesRepository.adminDashboard();
                return getDashboard;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminChartGraph(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getChart = yield this.adminSalesRepository.adminChartGraph(filters);
                return getChart;
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminSalesReport(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getReport = yield this.adminSalesRepository.adminSalesReport(filters);
                return getReport;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AdminSalesServices;
const adminSalesRepository = new sales_repository_1.default();
exports.adminSalesServices = new AdminSalesServices(adminSalesRepository);
