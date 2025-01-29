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
const responseUtil_1 = require("../../utils/responseUtil");
class MentorController {
    constructor(mentorServices) {
        this.mentorServices = mentorServices;
    }
    MentorLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const logUser = yield this.mentorServices.MentorLogin(email, password);
                (0, responseUtil_1.SuccessResponse)(res, 200, "Mentor Logged", logUser);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'PasswordInvalid' || error.name === 'EmailNotFound') {
                        (0, responseUtil_1.ErrorResponse)(res, 401, "Invalid Credentials");
                        return;
                    }
                    if (error.name === 'MentorBlocked') {
                        (0, responseUtil_1.ErrorResponse)(res, 403, "Mentor Blocked");
                        return;
                    }
                }
                (0, responseUtil_1.ErrorResponse)(res, 500, 'Internal Server Error');
                return;
            }
        });
    }
}
exports.default = MentorController;
