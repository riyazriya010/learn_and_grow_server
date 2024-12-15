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
const user_model_1 = __importDefault(require("../models/user.model"));
const base_repository_1 = __importDefault(require("./base.repository"));
class UserRepositories {
    constructor() {
        this.baseRepository = new base_repository_1.default(user_model_1.default);
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.baseRepository.findOne({ email });
            return user;
        });
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.baseRepository.findUsers();
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('user repo - createUser: ', data);
            const response = yield this.baseRepository.createUser(data);
            return response;
        });
    }
}
exports.default = UserRepositories;
