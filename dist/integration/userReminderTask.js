"use strict";
// import cron from 'node-cron';
// import userService from '../services/userService';
// // import sendEmail from '../utils/emailSender';
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
// // Cron job to run every day at midnight
// cron.schedule('0 0 * * *', async () => {
//   const inactiveUsers = await userService.getInactiveUsers();
// //   if (inactiveUsers.length > 0) {
// //     inactiveUsers.forEach(async (user) => {
// //       await sendEmail(
// //         user.email,
// //         'We Miss You!',
// //         'It looks like you haven\'t logged in for a while. Come back and check out what\'s new!'
// //       );
// //     });
//   } else {
//     console.log('No users need to be reminded.');
//   }
// });
const node_cron_1 = __importDefault(require("node-cron"));
const user_model_1 = __importDefault(require("../models/user.model"));
const nodemailer_1 = __importDefault(require("./nodemailer"));
node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Checking users with 0 studied hours...");
    try {
        // Fetch users whose studiedHours is 0
        const inactiveUsers = yield user_model_1.default.find({ studiedHours: 0 });
        if (inactiveUsers.length > 0) {
            inactiveUsers.forEach((user) => {
                console.log(`User ${user.username} has studied 0 hours.`);
                const mail = new nodemailer_1.default();
                mail.sendRemainderMail(String(user === null || user === void 0 ? void 0 : user.email), String(user === null || user === void 0 ? void 0 : user.username))
                    .then(info => {
                    console.log('Verification email sent successfully: ');
                })
                    .catch(error => {
                    console.error('Failed to send verification email:', error);
                });
            });
        }
        else {
            console.log('No users with 0 studied hours.');
        }
    }
    catch (error) {
        console.error("Error fetching users:", error);
    }
}));
