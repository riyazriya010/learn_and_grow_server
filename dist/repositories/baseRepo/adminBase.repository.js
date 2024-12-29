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
exports.AdminBaseRepository = void 0;
class AdminBaseRepository {
    constructor(model) {
        this.model = model;
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.find();
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getMentors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.find();
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    blockMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the mentor by ID
                const mentor = yield this.model.findById(id).exec();
                // Check if the mentor exists
                if (!mentor) {
                    throw new Error('Mentor not found');
                }
                const mentorToUpdate = mentor;
                // Update the `isBlocked` field
                mentorToUpdate.isBlocked = true;
                // Save the updated mentor document
                const updatedMentor = yield mentor.save();
                // Return the updated mentor
                return updatedMentor;
            }
            catch (error) {
                // Log the error and rethrow it for further handling
                console.error('Error blocking mentor:', error);
                throw new Error('Failed to block mentor');
            }
        });
    }
    unBlockMentor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mentor = yield this.model.findById(id).exec();
                if (!mentor) {
                    throw new Error('Mentor not found');
                }
                const mentorToUpdate = mentor;
                mentorToUpdate.isBlocked = false;
                const updatedMentor = yield mentor.save();
                return updatedMentor;
            }
            catch (error) {
                console.error('Error Unblocking mentor:', error);
                throw new Error('Failed to Unblock mentor');
            }
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.model.findByIdAndUpdate(id, { isBlocked: true }, { new: true } // Return the updated document
                ).exec();
                if (!updatedUser) {
                    throw new Error('User not found');
                }
                return updatedUser;
            }
            catch (error) {
                console.error('Error blocking User:', error);
                throw new Error('Failed to block User');
            }
        });
    }
    unBlockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield this.model.findByIdAndUpdate(id, { isBlocked: false }, { new: true } // Return the updated document
                ).exec();
                if (!updatedUser) {
                    throw new Error('User not found');
                }
                return updatedUser;
            }
            catch (error) {
                console.error('Error Unblocking User:', error);
                throw new Error('Failed to Unblock User');
            }
        });
    }
}
exports.AdminBaseRepository = AdminBaseRepository;
