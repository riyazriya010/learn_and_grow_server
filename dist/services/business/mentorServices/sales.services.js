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
exports.mentorSalesServices = void 0;
const sales_repository_1 = __importDefault(require("../../../repositories/entities/mentorRepositories/sales.repository"));
class MentorSalesServices {
    constructor(mentorSalesRepository) {
        this.mentorSalesRepository = mentorSalesRepository;
    }
    mentorDashboard(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getData = yield this.mentorSalesRepository.mentorDashboard(mentorId);
                return getData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorChartGraph(mentorId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getData = yield this.mentorSalesRepository.mentorChartGraph(mentorId, filters);
                return getData;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorSalesReport(mentorId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getData = yield this.mentorSalesRepository.mentorSalesReport(mentorId, filters);
                return getData;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorSalesServices;
const mentorSalesRepository = new sales_repository_1.default();
exports.mentorSalesServices = new MentorSalesServices(mentorSalesRepository);
