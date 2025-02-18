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
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../utils/constants");
class JwtService {
    createToken(user, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const syncToken = yield jsonwebtoken_1.default.sign({ user, role }, String(constants_1.JWT_SECRET), { expiresIn: '2h' });
                return syncToken;
            }
            catch (error) {
                console.log(error.message);
            }
        });
    }
    createRefreshToken(user, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const syncToken = yield jsonwebtoken_1.default.sign({ user, role }, String(constants_1.JWT_SECRET), { expiresIn: '7d' });
                return syncToken;
            }
            catch (error) {
                console.log(error.message);
            }
        });
    }
    //Expiration verifyToken
    isTokenExpired(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = jsonwebtoken_1.default.decode(token);
                const currentTime = Math.floor(Date.now() / 1000);
                return decodedToken.exp < currentTime;
            }
            catch (error) {
                console.log("Error in access token expiry Check :", error);
                throw new Error("user not authorised");
            }
        });
    }
}
exports.JwtService = JwtService;
