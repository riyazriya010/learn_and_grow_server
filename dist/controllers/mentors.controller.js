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
exports.MentorController = void 0;
const mentorService_1 = require("../services/mentorService");
class MentorController {
    constructor() {
        this.mentorServices = new mentorService_1.MentorServices();
    }
    mentorSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, phone, password, expertise, skills } = req.body;
                const ExistMentor = yield this.mentorServices.findByEmail(email);
                if (ExistMentor) {
                    res.status(409).send({ message: 'Mentor Already Exist', success: false });
                }
                const addedMentor = yield this.mentorServices.mentorSignUp({
                    username, email, phone, password, expertise, skills
                });
                res.status(201).send({ user: addedMentor, message: 'Mentor Added Successfully', success: true });
            }
            catch (error) {
                console.log(error.message);
            }
        });
    }
}
exports.MentorController = MentorController;
