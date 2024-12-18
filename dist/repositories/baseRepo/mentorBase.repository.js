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
class MentorBaseRepository {
    constructor(model) {
        this.model = model;
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ email: email });
        });
    }
    mentorSignUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modifiedData = Object.assign(Object.assign({}, data), { role: 'mentor' });
                const document = new this.model(modifiedData);
                const savedUser = yield document.save();
                return savedUser;
            }
            catch (error) {
                console.log(error.message);
                return null;
            }
        });
    }
}
exports.default = MentorBaseRepository;
