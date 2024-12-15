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
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find();
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            // Using lean() to return plain JavaScript objects instead of Mongoose Document
            const foundUser = yield this.model.findOne(query).lean().exec();
            if (!foundUser) {
                return null;
            }
            return foundUser;
        });
    }
    findUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.model.find().exec(); // No .lean() used
            if (!users || users.length === 0) {
                return null;
            }
            return users; // Returns Mongoose documents
        });
    }
    findByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.model.findOne({ phone: phone });
            return true;
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, phone, password } = userData;
            if (!username || !email || !phone || !password) {
                throw new Error("Missing required fields");
            }
            const modifiedData = {
                username,
                email,
                phone,
                password,
                role: "user",
                studiedHours: 0,
            };
            const document = new this.model(modifiedData);
            const savedUser = yield document.save();
            return savedUser;
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedUser = yield this.model.findByIdAndDelete(id).exec();
            return deletedUser;
        });
    }
}
exports.default = BaseRepository;
