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
const mongoose_1 = __importDefault(require("mongoose"));
const adminBadge_model_1 = require("../../../models/adminBadge.model");
const studentBadges_model_1 = require("../../../models/studentBadges.model");
const userWallet_model_1 = require("../../../models/userWallet.model");
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
const purchased_model_1 = require("../../../models/purchased.model");
const uploadCourse_model_1 = require("../../../models/uploadCourse.model");
const chapter_model_1 = require("../../../models/chapter.model");
class StudentRewardRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            Badge: studentBadges_model_1.BadgeModel,
            UserWallet: userWallet_model_1.UserWalletModel,
            BadgeManagement: adminBadge_model_1.BadgeManagementModel,
            Course: uploadCourse_model_1.CourseModel,
            Purchase: purchased_model_1.PurchasedCourseModel,
            Chapters: chapter_model_1.ChapterModel
        });
    }
    studentRewardConvert(badgeId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findBadge = yield this.findById('Badge', badgeId);
                if (findBadge) {
                    const badge = yield this.findById('BadgeManagement', String(findBadge === null || findBadge === void 0 ? void 0 : findBadge.badgeId));
                    const badgeName = badge === null || badge === void 0 ? void 0 : badge.badgeName;
                    // Fetch badge value directly from the Badge collection
                    const value = Number(badge === null || badge === void 0 ? void 0 : badge.value);
                    if (isNaN(value)) {
                        throw new Error("Invalid badge value");
                    }
                    // Find the user's wallet
                    let userWallet = yield this.findOne('UserWallet', { userId: studentId });
                    if (userWallet) {
                        // Add value to the wallet balance
                        userWallet.balance += value;
                        // Add transaction record
                        userWallet.transactions.push({
                            type: "credit",
                            amount: value,
                            date: new Date(),
                            description: `${badgeName} Reward`,
                        });
                        // Save wallet update
                        yield userWallet.save();
                    }
                    else {
                        // Create a new wallet if it doesn't exist
                        userWallet = yield this.createData('UserWallet', {
                            userId: new mongoose_1.default.Types.ObjectId(studentId),
                            balance: value,
                            transactions: [
                                {
                                    type: "credit",
                                    amount: value,
                                    date: new Date(),
                                    description: `${badgeName} Reward`,
                                },
                            ],
                        });
                    }
                    console.log("Updated Wallet:", userWallet);
                    const deleteBadge = yield this.deleteById('Badge', badgeId);
                    return deleteBadge;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentWallet(studentId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const pageNumber = Number(page) || 1;
                const limitNumber = Number(limit) || 10;
                const studentWallet = yield userWallet_model_1.UserWalletModel.findOne({ userId: new mongoose_1.default.Types.ObjectId(studentId) }, {
                    balance: 1,
                    transactions: { $slice: [(pageNumber - 1) * limitNumber, limitNumber] }
                });
                if (!studentWallet) {
                    throw new Error("Wallet not found");
                }
                const totalTransactions = yield userWallet_model_1.UserWalletModel.aggregate([
                    { $match: { userId: new mongoose_1.default.Types.ObjectId(studentId) } },
                    { $project: { total: { $size: "$transactions" } } }
                ]);
                const totalWallets = ((_a = totalTransactions[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
                const totalPages = Math.ceil(totalWallets / limitNumber);
                return {
                    wallets: {
                        balance: studentWallet.balance,
                        transactions: studentWallet.transactions,
                    },
                    currentPage: pageNumber,
                    totalPages,
                    totalWallets,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentWalletBalance(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getBalance = yield this.findOne('UserWallet', { userId: studentId });
                return getBalance === null || getBalance === void 0 ? void 0 : getBalance.balance;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentwalletBuyCourse(studentId, price, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCourse = yield this.findById('Course', courseId);
                const mentorId = findCourse === null || findCourse === void 0 ? void 0 : findCourse.mentorId;
                const findChapters = yield this.findAll('Chapters', { courseId: courseId });
                if (findChapters.length === 0) {
                    const error = new Error('Chapters Not Found');
                    error.name = "Chapters Not Found";
                    throw error;
                }
                const completedChapters = findChapters.map((chapter) => ({
                    chapterId: chapter._id,
                    isCompleted: false,
                }));
                const purchasedCourse = {
                    userId: new mongoose_1.default.Types.ObjectId(studentId), // ✅ Correct
                    courseId: new mongoose_1.default.Types.ObjectId(courseId), // ✅ Correct
                    mentorId: mentorId ? new mongoose_1.default.Types.ObjectId(String(mentorId)) : undefined, // Convert if not undefined
                    transactionId: `Wallet Buyed`,
                    completedChapters,
                    isCourseCompleted: false,
                    price: Number(price),
                };
                const createdCourse = yield this.createData('Purchase', purchasedCourse);
                //dedection from user wallet
                const findWallet = yield this.findOne('UserWallet', { userId: studentId });
                if (!findWallet) {
                    throw new Error("Wallet not found");
                }
                // Deduct balance correctly
                findWallet.balance -= Number(price);
                // Add transaction entry
                findWallet.transactions.push({
                    type: 'debit',
                    amount: Number(price),
                    date: new Date(),
                    description: 'Course Purchased',
                });
                // Save updated wallet
                yield findWallet.save();
                return createdCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentRewardRepository;
