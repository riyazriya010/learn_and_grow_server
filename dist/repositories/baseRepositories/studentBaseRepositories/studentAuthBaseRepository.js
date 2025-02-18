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
class StudentAuthBaseRepository {
    constructor(model) {
        this.model = model;
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.model.findOne({ email });
            }
            catch (error) {
                throw error;
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.model.findById(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
    createStudent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.model.create(data);
                return user.toObject();
            }
            catch (error) {
                throw error;
            }
        });
    }
    findByIdAndUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateUser = yield this.model.findByIdAndUpdate(id, data, { new: true });
                return updateUser === null || updateUser === void 0 ? void 0 : updateUser.toObject();
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentAuthBaseRepository;
