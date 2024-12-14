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
exports.UserRepository = void 0;
const user_model_1 = require("../models/user.model");
class UserRepository {
    // Method to create a new user
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if a user with the same email already exists
            const existingUserByEmail = yield user_model_1.User.findOne({ email: userData.email });
            if (existingUserByEmail) {
                throw new Error('User with this email already exists');
            }
            // Check if a user with the same phone already exists
            const existingUserByPhone = yield user_model_1.User.findOne({ phone: userData.phone });
            if (existingUserByPhone) {
                throw new Error('User with this phone number already exists');
            }
            // Create a new user document in the database
            const newUser = new user_model_1.User(userData);
            // Save the user to the database and return it
            return newUser.save();
        });
    }
    // Method to find a user by email
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.User.findOne({ email });
        });
    }
    // Method to find a user by phone number
    findUserByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.User.findOne({ phone });
        });
    }
}
exports.UserRepository = UserRepository;
