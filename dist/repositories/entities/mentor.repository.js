"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mongoose_1 = __importStar(require("mongoose"));
const categroy_model_1 = require("../../models/categroy.model");
const chapter_model_1 = require("../../models/chapter.model");
const chatRooms_model_1 = require("../../models/chatRooms.model");
const mentor_model_1 = __importDefault(require("../../models/mentor.model"));
const messages_model_1 = require("../../models/messages.model");
const quizz_model_1 = __importDefault(require("../../models/quizz.model"));
const uploadCourse_model_1 = require("../../models/uploadCourse.model");
const mentorWallet_model_1 = require("../../models/mentorWallet.model");
const user_model_1 = __importDefault(require("../../models/user.model"));
const mentorNotification_model_1 = require("../../models/mentorNotification.model");
// import { startOfDay, endOfDay, subMonths, subYears, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
const date_fns_1 = require("date-fns");
const purchased_model_1 = require("../../models/purchased.model");
class MentorRepository {
    //////////////////////// WEEK - 1 ////////////////////////////////////
    mentorLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logUesr = yield mentor_model_1.default.findOne({ email: email });
                return logUesr;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorSignUp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existUser = yield mentor_model_1.default.findOne({ email: userData.email });
                if (existUser) {
                    const error = new Error('Mentor Already Exist');
                    error.name = 'MentorExist';
                    throw error;
                }
                const { username, email, phone, password, expertise, skills } = userData;
                const modifiedUser = {
                    username,
                    email,
                    phone,
                    password,
                    expertise,
                    skills,
                    role: 'mentor',
                };
                const newMentor = new mentor_model_1.default(modifiedUser);
                yield newMentor.save();
                return newMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGoogleSignUp(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existMentor = yield mentor_model_1.default.findOne({ email });
                if (existMentor) {
                    const error = new Error('Mentor Already Exist');
                    error.name = 'MentorExist';
                    throw error;
                }
                const data = {
                    username: displayName,
                    email,
                    phone: 'Not Provided',
                    expertise: 'Not Provided',
                    skills: 'Not Provided',
                    password: 'null',
                    role: 'mentor',
                    isVerified: true
                };
                const document = new mentor_model_1.default(data);
                const savedMentor = yield document.save();
                return savedMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const logMentor = yield mentor_model_1.default.findOne({ email });
                return logMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorForgetPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findMentor = yield mentor_model_1.default.findOne({ email });
                if (!findMentor) {
                    const error = new Error("Mentor Not Found");
                    error.name = "MentorNotFound";
                    throw error;
                }
                findMentor.password = password;
                yield findMentor.save();
                return findMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorProfileUpdate(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mentorData = {
                    username: userData.username,
                    phone: userData.phone,
                };
                if (userData.profilePicUrl) {
                    mentorData.profilePicUrl = userData.profilePicUrl;
                }
                const updatedProfile = yield mentor_model_1.default.findByIdAndUpdate(userId, mentorData, { new: true });
                return updatedProfile;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorCheck(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkMentor = yield mentor_model_1.default.findById(userId);
                return checkMentor;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield mentor_model_1.default.findOne({ email });
                findUser.isVerified = true;
                const verifiyedUser = yield findUser.save();
                return verifiyedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorReVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield mentor_model_1.default.findOne({ email });
                findUser.isVerified = true;
                const verifiyedUser = yield findUser.save();
                return verifiyedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    //////////////////////// WEEK - 2 ////////////////////////////////////
    mentorAddCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCategory = yield categroy_model_1.CategoryModel.findOne({ categoryName: data.category });
                data.categoryId = findCategory === null || findCategory === void 0 ? void 0 : findCategory._id;
                const isExist = yield uploadCourse_model_1.CourseModel.findOne({ courseName: data.courseName });
                if (isExist) {
                    const error = new Error('Already Exist');
                    error.name = 'AlreadyExist';
                    throw error;
                }
                const response = yield uploadCourse_model_1.CourseModel.create(data);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllCourse(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const response = yield uploadCourse_model_1.CourseModel
                    .find({ mentorId: userId })
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCourses = yield uploadCourse_model_1.CourseModel.countDocuments();
                if (!response || response.length === 0) {
                    const error = new Error('Courses Not Found');
                    error.name = 'CoursesNotFound';
                    throw error;
                }
                return {
                    courses: response,
                    currentPage: page,
                    totalPages: Math.ceil(totalCourses / limit),
                    totalCourses: totalCourses
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCourse = yield uploadCourse_model_1.CourseModel.findById(courseId);
                return getCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorEditCourse(courseId, updatingData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = yield uploadCourse_model_1.CourseModel.findOne({
                    courseName: updatingData.courseName,
                    _id: { $ne: courseId }
                });
                if (isExist) {
                    const error = new Error('Already Exist');
                    error.name = 'AlreadyExist';
                    throw error;
                }
                const response = yield uploadCourse_model_1.CourseModel.findByIdAndUpdate(courseId, updatingData, { new: true });
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorUnPulishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unPublish = yield uploadCourse_model_1.CourseModel.findByIdAndUpdate(courseId, { isPublished: false }, { new: true });
                return unPublish;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorPublishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const publish = yield uploadCourse_model_1.CourseModel.findByIdAndUpdate(courseId, { isPublished: true }, { new: true });
                return publish;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorFilterCourse(page, limit, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const query = {};
                if (searchTerm !== 'undefined') {
                    query.courseName = { $regex: searchTerm, $options: 'i' };
                }
                const courses = yield uploadCourse_model_1.CourseModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
                const totalCourses = yield uploadCourse_model_1.CourseModel.countDocuments(query);
                if (!courses || courses.length === 0) {
                    const error = new Error('Course Not Found');
                    error.name = 'CourseNotFound';
                    throw error;
                }
                return {
                    courses,
                    currentPage: page,
                    totalPages: Math.ceil(totalCourses / limit),
                    totalCourses,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllCategorise() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllCategories = yield categroy_model_1.CategoryModel.find();
                return getAllCategories;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorAddChapter(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newDocument = new chapter_model_1.ChapterModel(data);
                const savedChapter = yield newDocument.save();
                yield uploadCourse_model_1.CourseModel.findByIdAndUpdate(data.courseId, {
                    $push: {
                        fullVideo: { chapterId: savedChapter._id },
                    },
                }, { new: true });
                return savedChapter;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorEditChapter(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const datas = {
                    chapterTitle: data.title,
                    description: data.description,
                };
                if (data.fileLocation) {
                    datas.videoUrl = data.fileLocation;
                }
                const updatedChapter = yield chapter_model_1.ChapterModel.findByIdAndUpdate(data.chapterId, { $set: datas }, { new: true });
                return updatedChapter;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllChapters(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getChapters = yield chapter_model_1.ChapterModel.find({ courseId });
                return getChapters;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorAddQuizz(data, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findQuizz = yield quizz_model_1.default.findOne({ courseId: courseId });
                const questionData = {
                    question: data.question,
                    options: [data.option1, data.option2],
                    correct_answer: data.correctAnswer,
                };
                const questionExist = findQuizz === null || findQuizz === void 0 ? void 0 : findQuizz.questions.some(q => q.question === data.question);
                if (questionExist) {
                    const error = new Error('Question Already Exist');
                    error.name = 'QuestionAlreadyExist';
                    throw error;
                }
                if (findQuizz) {
                    findQuizz.questions.push(questionData);
                    yield findQuizz.save();
                    return findQuizz;
                }
                const newQuizz = yield quizz_model_1.default.create({ courseId: courseId, questions: [questionData] });
                return newQuizz;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetAllQuizz(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllQuizz = yield quizz_model_1.default.find({ courseId });
                return getAllQuizz;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorDeleteQuizz(courseId, quizzId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findQuizz = yield quizz_model_1.default.findOne({ courseId });
                const objectIdQuizId = new mongoose_1.default.Types.ObjectId(quizzId);
                findQuizz.questions = findQuizz.questions.filter((question) => !question._id.equals(objectIdQuizId));
                const updatedQuizz = yield findQuizz.save();
                return updatedQuizz;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetWallet(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const response = yield mentorWallet_model_1.MentorWalletModel
                    .find({ mentorId: userId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .select("-__v"); // Exclude the `__v` field if unnecessary
                // Count total wallet documents for the mentor
                const totalWallets = yield mentorWallet_model_1.MentorWalletModel.countDocuments({ mentorId: userId });
                return {
                    wallets: response, // Renamed to `wallets` for better readability
                    currentPage: page,
                    totalPages: Math.ceil(totalWallets / limit),
                    totalWallets,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    ////////////////////////// WEEK - 3 //////////////////////////////////////////
    mentorChatGetStudents(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUsers = yield chatRooms_model_1.ChatRoomsModel.find({ mentorId })
                    .populate({
                    path: "studentId",
                    select: "_id username profilePicUrl"
                });
                const uniqueStudents = new Set();
                const formatted = [];
                for (const data of getUsers) {
                    const student = data.studentId;
                    if (student && !uniqueStudents.has(student._id.toString())) {
                        uniqueStudents.add(student._id.toString());
                        // Fetch the chat room for this student and mentor
                        const getRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({
                            mentorId,
                            studentId: student._id,
                        });
                        // Add student data with lastMessage and updatedAt
                        formatted.push({
                            studentData: Object.assign(Object.assign({}, student.toObject()), { lastMessage: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.lastMessage) || null, mentorMsgCount: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.mentorMsgCount) || 0 }),
                            updatedAt: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.updatedAt) || new Date(0), // Default to old date if no chat exists
                        });
                    }
                }
                formatted.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
                return formatted;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetMessages(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ studentId, mentorId });
                const roomId = findRoom._id;
                const findMessages = yield messages_model_1.MessageModel.find({ roomId });
                return findMessages;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorSaveMessage(studentId, mentorId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ studentId, mentorId });
                findRoom.lastMessage = message;
                findRoom.userMsgCount += 1;
                yield findRoom.save();
                const data = {
                    senderId: mentorId,
                    receiverId: studentId,
                    roomId: findRoom === null || findRoom === void 0 ? void 0 : findRoom._id,
                    message: message,
                    senderModel: "Mentors",
                    receiverModel: "User"
                };
                const newMessage = new messages_model_1.MessageModel(data);
                const savedMessage = yield newMessage.save();
                return savedMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorCreateRoom(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ studentId, mentorId });
                if (existRoom) {
                    return existRoom;
                }
                const roomData = {
                    studentId,
                    mentorId
                };
                const newRoom = new chatRooms_model_1.ChatRoomsModel(roomData);
                const createdRoom = yield newRoom.save();
                return createdRoom;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorDeleteEveryOne(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findMessage = yield messages_model_1.MessageModel.findById(messageId);
                findMessage.deletedForSender = true;
                findMessage.deletedForReceiver = true;
                yield findMessage.save();
                // Update chat room's last message if necessary
                const chatRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ _id: findMessage.roomId });
                if (chatRoom) {
                    const remainingMessages = yield messages_model_1.MessageModel.find({ roomId: chatRoom._id });
                    const validMessages = remainingMessages.filter(msg => !msg.deletedForSender && !msg.deletedForReceiver);
                    if (validMessages.length > 0) {
                        const lastMessage = validMessages[validMessages.length - 1];
                        chatRoom.lastMessage = lastMessage.message;
                    }
                    else {
                        chatRoom.lastMessage = '';
                    }
                    yield chatRoom.save();
                }
                return findMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorDeleteForMe(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findMessage = yield messages_model_1.MessageModel.findById(messageId);
                findMessage.deletedForSender = true;
                yield findMessage.save();
                // Check if this is the last message sent by the sender, and update chat room's last message
                const chatRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ _id: findMessage.roomId });
                if (chatRoom) {
                    const remainingMessages = yield messages_model_1.MessageModel.find({ roomId: chatRoom._id });
                    const validMessages = remainingMessages.filter(msg => !msg.deletedForSender);
                    if (validMessages.length > 0) {
                        const lastMessage = validMessages[validMessages.length - 1];
                        chatRoom.lastMessage = lastMessage.message;
                    }
                    else {
                        chatRoom.lastMessage = '';
                    }
                    yield chatRoom.save();
                }
                return findMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorResetCount(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ studentId, mentorId });
                findRoom.mentorMsgCount = 0;
                yield findRoom.save();
                //find messages
                const findMessages = yield messages_model_1.MessageModel.find({ roomId: findRoom.id });
                return findMessages;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorCreateNotification(username, senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    senderId,
                    receiverId,
                    senderName: username
                };
                const createNotification = new mentorNotification_model_1.MentorNotificationModel(data);
                yield createNotification.save();
                return createNotification;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetNotificationsCount(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getNotification = yield mentorNotification_model_1.MentorNotificationModel.find({ receiverId: mentorId, seen: false }).countDocuments();
                return { count: getNotification };
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetNotifications(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allNotifications = yield mentorNotification_model_1.MentorNotificationModel
                    .find({ receiverId: mentorId })
                    .sort({ createdAt: -1 });
                // Remove duplicate senderId notifications (keeping only the most recent)
                const seenSenders = new Set();
                const uniqueNotifications = allNotifications.filter(notification => {
                    if (!seenSenders.has(notification.senderId.toString())) {
                        seenSenders.add(notification.senderId.toString());
                        return true;
                    }
                    return false;
                });
                return uniqueNotifications;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetNotificationsSeen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const markSeen = yield mentorNotification_model_1.MentorNotificationModel.updateMany({ seen: false }, { $set: { seen: true } });
                return markSeen;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorDeleteNotifications(senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteMessage = yield mentorNotification_model_1.MentorNotificationModel.deleteMany({ senderId });
                return deleteMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorGetStudent(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findMentor = yield user_model_1.default.findById(studentId).select("_id username profilePicUrl");
                const getRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({
                    studentId,
                    mentorId,
                });
                return Object.assign(Object.assign({}, findMentor === null || findMentor === void 0 ? void 0 : findMentor.toObject()), { lastMessage: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.lastMessage) || null, userMsgCount: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.userMsgCount) || 0 });
            }
            catch (error) {
                throw error;
            }
        });
    }
    //////////////////////////////////// WEEK - 4 ////////////////////////////
    mentorDashboard(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const mentorObjectId = new mongoose_1.Types.ObjectId(mentorId);
                const todayStart = (0, date_fns_1.startOfDay)(new Date());
                const todayEnd = (0, date_fns_1.endOfDay)(new Date());
                // Get yesterday's date
                const yesterday = (0, date_fns_1.subDays)(new Date(), 1);
                // Last 30 days till yesterday
                const prevMonthStart = (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(yesterday, 29));
                const prevMonthEnd = (0, date_fns_1.endOfDay)(yesterday);
                // Last 365 days till yesterday
                const prevYearStart = (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(yesterday, 364));
                const prevYearEnd = (0, date_fns_1.endOfDay)(yesterday);
                // Last 6 months
                const sixMonthsStart = (0, date_fns_1.startOfDay)((0, date_fns_1.subMonths)(new Date(), 5));
                // 📌 1️⃣ Revenue Stats
                const revenueStats = yield purchased_model_1.PurchasedCourseModel.aggregate([
                    {
                        $match: {
                            mentorId: mentorObjectId,
                            purchasedAt: { $exists: true }
                        }
                    },
                    {
                        $group: {
                            _id: "$purchasedAt",
                            totalRevenue: { $sum: "$price" }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            todayRevenue: {
                                $sum: {
                                    $cond: [
                                        { $and: [{ $gte: ["$_id", todayStart] }, { $lte: ["$_id", todayEnd] }] },
                                        "$totalRevenue",
                                        0
                                    ]
                                }
                            },
                            prevMonthRevenue: {
                                $sum: {
                                    $cond: [
                                        { $and: [{ $gte: ["$_id", prevMonthStart] }, { $lte: ["$_id", prevMonthEnd] }] },
                                        "$totalRevenue",
                                        0
                                    ]
                                }
                            },
                            prevYearRevenue: {
                                $sum: {
                                    $cond: [
                                        { $and: [{ $gte: ["$_id", prevYearStart] }, { $lte: ["$_id", prevYearEnd] }] },
                                        "$totalRevenue",
                                        0
                                    ]
                                }
                            },
                            totalRevenue: { $sum: "$totalRevenue" }
                        }
                    }
                ]);
                // 📌 2️⃣ Course Performance Stats
                const courses = yield uploadCourse_model_1.CourseModel.find({ mentorId: mentorObjectId });
                const totalCourses = courses.length;
                const mostEnrolledCourse = yield purchased_model_1.PurchasedCourseModel.aggregate([
                    { $match: { mentorId: mentorObjectId } },
                    { $group: { _id: "$courseId", enrollments: { $sum: 1 } } },
                    { $sort: { enrollments: -1 } },
                    { $limit: 1 },
                    {
                        $lookup: {
                            from: "courses",
                            localField: "_id",
                            foreignField: "_id",
                            as: "courseDetails",
                        },
                    },
                    { $unwind: "$courseDetails" },
                    {
                        $project: {
                            _id: 1,
                            enrollments: 1,
                            courseName: "$courseDetails.courseName",
                        },
                    },
                ]);
                const leastEnrolledCourse = yield purchased_model_1.PurchasedCourseModel.aggregate([
                    { $match: { mentorId: mentorObjectId } },
                    { $group: { _id: "$courseId", enrollments: { $sum: 1 } } },
                    { $sort: { enrollments: 1 } },
                    { $limit: 1 },
                    {
                        $lookup: {
                            from: "courses",
                            localField: "_id",
                            foreignField: "_id",
                            as: "courseDetails",
                        },
                    },
                    { $unwind: "$courseDetails" },
                    {
                        $project: {
                            _id: 1,
                            enrollments: 1,
                            courseName: "$courseDetails.courseName",
                        },
                    },
                ]);
                // 📌 3️⃣ Student Engagement Stats
                const totalStudents = yield purchased_model_1.PurchasedCourseModel.countDocuments({ mentorId: mentorObjectId });
                const activeStudents = yield purchased_model_1.PurchasedCourseModel.countDocuments({
                    mentorId: mentorObjectId,
                    "completedChapters.completedAt": { $gte: (0, date_fns_1.subMonths)(new Date(), 1) }
                });
                const totalCompletedCourses = yield purchased_model_1.PurchasedCourseModel.countDocuments({
                    mentorId: mentorObjectId,
                    isCourseCompleted: true
                });
                const courseCompletionRate = totalStudents > 0 ? Math.floor((totalCompletedCourses / totalStudents) * 100) : 0;
                // 📌 4️⃣ Sales & Revenue Trends (Last 6 Months)
                const salesTrends = yield purchased_model_1.PurchasedCourseModel.aggregate([
                    {
                        $match: {
                            mentorId: mentorObjectId,
                            purchasedAt: { $gte: sixMonthsStart }
                        }
                    },
                    {
                        $group: {
                            _id: { $month: "$purchasedAt" },
                            salesCount: { $sum: 1 },
                            revenue: { $sum: "$price" }
                        }
                    },
                    { $sort: { "_id": 1 } }
                ]);
                // 📌 5️⃣ Top Performing Courses
                const topCourses = yield purchased_model_1.PurchasedCourseModel.aggregate([
                    { $match: { mentorId: mentorObjectId } },
                    { $group: { _id: "$courseId", revenue: { $sum: "$price" }, enrollments: { $sum: 1 } } },
                    { $sort: { revenue: -1 } },
                    { $limit: 5 }
                ]);
                return {
                    // Revenue Overview
                    todayRevenue: ((_a = revenueStats[0]) === null || _a === void 0 ? void 0 : _a.todayRevenue) || 0,
                    prevMonthRevenue: ((_b = revenueStats[0]) === null || _b === void 0 ? void 0 : _b.prevMonthRevenue) || 0,
                    prevYearRevenue: ((_c = revenueStats[0]) === null || _c === void 0 ? void 0 : _c.prevYearRevenue) || 0,
                    totalRevenue: ((_d = revenueStats[0]) === null || _d === void 0 ? void 0 : _d.totalRevenue) || 0,
                    // Course Performance
                    totalCourses,
                    mostEnrolledCourse: mostEnrolledCourse.length ? mostEnrolledCourse[0] : "N/A",
                    leastEnrolledCourse: leastEnrolledCourse.length ? leastEnrolledCourse[0] : "N/A",
                    // Student Engagement
                    totalStudents,
                    activeStudents,
                    courseCompletionRate,
                    // Sales Trends
                    salesTrends,
                    // Top Performing Courses
                    topCourses
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorChartGraph(mentorId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mentorId = new mongoose_1.Types.ObjectId("676e807be8f82e659d704d72");
                const { year, month, date } = filters;
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth() + 1;
                const filterYear = year ? parseInt(year) : currentYear;
                // Default empty arrays for courseSales and revenueOrders
                let courseSales = [];
                let revenueOrders = [];
                // If the date is provided, filter for the specific date
                if (date) {
                    const specificDate = new Date(date);
                    const startOfDay = new Date(specificDate.setHours(0, 0, 0, 0));
                    const endOfDay = new Date(specificDate.setHours(23, 59, 59, 999));
                    courseSales = yield purchased_model_1.PurchasedCourseModel.aggregate([
                        {
                            $match: {
                                mentorId: mentorId,
                                purchasedAt: { $gte: startOfDay, $lt: endOfDay },
                            }
                        },
                        {
                            $group: {
                                _id: "$courseId",
                                totalSales: { $sum: 1 }
                            }
                        },
                        {
                            $lookup: {
                                from: "courses",
                                localField: "_id",
                                foreignField: "_id",
                                as: "courseDetails"
                            }
                        },
                        { $unwind: "$courseDetails" },
                        {
                            $project: {
                                _id: 0,
                                courseName: "$courseDetails.courseName",
                                totalSales: 1
                            }
                        }
                    ]);
                    let totalPurchases = courseSales.reduce((sum, course) => sum + course.totalSales, 0);
                    courseSales = courseSales.map(course => ({
                        courseName: course.courseName,
                        percentage: totalPurchases > 0 ? ((course.totalSales / totalPurchases) * 100).toFixed(2) : "0.00"
                    }));
                    if (courseSales.length === 0) {
                        courseSales = [{ courseName: "No sales data", percentage: "0.00" }];
                    }
                    revenueOrders = yield purchased_model_1.PurchasedCourseModel.aggregate([
                        {
                            $match: {
                                mentorId: mentorId,
                                purchasedAt: { $gte: startOfDay, $lt: endOfDay },
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalRevenue: { $sum: "$price" },
                                totalOrders: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                totalRevenue: 1,
                                totalOrders: 1,
                                _id: 0
                            }
                        }
                    ]);
                }
                // If year and month are provided, filter by year and month
                else if (month) {
                    const monthIndex = new Date(`${month} 1, 2022`).getMonth() + 1;
                    const startOfMonth = new Date(`${filterYear}-${String(monthIndex).padStart(2, '0')}-01`);
                    const endOfMonth = new Date(startOfMonth);
                    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                    courseSales = yield purchased_model_1.PurchasedCourseModel.aggregate([
                        {
                            $match: {
                                mentorId: mentorId,
                                purchasedAt: { $gte: startOfMonth, $lt: endOfMonth },
                            }
                        },
                        {
                            $group: {
                                _id: "$courseId",
                                totalSales: { $sum: 1 }
                            }
                        },
                        {
                            $lookup: {
                                from: "courses",
                                localField: "_id",
                                foreignField: "_id",
                                as: "courseDetails"
                            }
                        },
                        { $unwind: "$courseDetails" },
                        {
                            $project: {
                                _id: 0,
                                courseName: "$courseDetails.courseName",
                                totalSales: 1
                            }
                        }
                    ]);
                    let totalPurchases = courseSales.reduce((sum, course) => sum + course.totalSales, 0);
                    courseSales = courseSales.map(course => ({
                        courseName: course.courseName,
                        percentage: totalPurchases > 0 ? ((course.totalSales / totalPurchases) * 100).toFixed(2) : "0.00"
                    }));
                    if (courseSales.length === 0) {
                        courseSales = [{ courseName: "No sales data", percentage: "0.00" }];
                    }
                    revenueOrders = yield purchased_model_1.PurchasedCourseModel.aggregate([
                        {
                            $match: {
                                mentorId: mentorId,
                                purchasedAt: { $gte: startOfMonth, $lt: endOfMonth },
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalRevenue: { $sum: "$price" },
                                totalOrders: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                totalRevenue: 1,
                                totalOrders: 1,
                                _id: 0
                            }
                        }
                    ]);
                }
                // If only the year is provided, fetch data for the whole year
                else {
                    courseSales = yield purchased_model_1.PurchasedCourseModel.aggregate([
                        {
                            $match: {
                                mentorId: mentorId,
                                purchasedAt: {
                                    $gte: new Date(`${filterYear}-01-01`),
                                    $lt: new Date(`${filterYear + 1}-01-01`),
                                }
                            }
                        },
                        {
                            $group: {
                                _id: "$courseId",
                                totalSales: { $sum: 1 }
                            }
                        },
                        {
                            $lookup: {
                                from: "courses",
                                localField: "_id",
                                foreignField: "_id",
                                as: "courseDetails"
                            }
                        },
                        { $unwind: "$courseDetails" },
                        {
                            $project: {
                                _id: 0,
                                courseName: "$courseDetails.courseName",
                                totalSales: 1
                            }
                        }
                    ]);
                    let totalPurchases = courseSales.reduce((sum, course) => sum + course.totalSales, 0);
                    courseSales = courseSales.map(course => ({
                        courseName: course.courseName,
                        percentage: totalPurchases > 0 ? ((course.totalSales / totalPurchases) * 100).toFixed(2) : "0.00"
                    }));
                    if (courseSales.length === 0) {
                        courseSales = [{ courseName: "No sales data", percentage: "0.00" }];
                    }
                    revenueOrders = yield purchased_model_1.PurchasedCourseModel.aggregate([
                        {
                            $match: {
                                mentorId: mentorId,
                                purchasedAt: {
                                    $gte: new Date(`${filterYear}-01-01`),
                                    $lt: new Date(`${filterYear + 1}-01-01`),
                                }
                            }
                        },
                        {
                            $group: {
                                _id: { $month: "$purchasedAt" },
                                totalRevenue: { $sum: "$price" },
                                totalOrders: { $sum: 1 }
                            }
                        },
                        {
                            $sort: { _id: 1 }
                        },
                        {
                            $project: {
                                month: "$_id",
                                totalRevenue: 1,
                                totalOrders: 1,
                                _id: 0
                            }
                        }
                    ]);
                }
                return {
                    year: filterYear,
                    courseSales: courseSales,
                    revenueOrders: revenueOrders
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorSalesReport(mentorId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mentorIdObject = new mongoose_1.Types.ObjectId(mentorId);
                const { year, month, date } = filters;
                const currentYear = new Date().getFullYear();
                const filterYear = year ? parseInt(year) : currentYear;
                let report = [];
                let salesCount = 0;
                let dateFilter = {};
                if (date) {
                    const startOfDay = new Date(date.startDate);
                    startOfDay.setHours(0, 0, 0, 0);
                    const endOfDay = new Date(date.endDate);
                    endOfDay.setHours(23, 59, 59, 999);
                    dateFilter = { purchasedAt: { $gte: startOfDay, $lt: endOfDay } };
                }
                else if (month) {
                    const monthIndex = new Date(`${month} 1, 2022`).getMonth() + 1;
                    const startOfMonth = new Date(`${filterYear}-${String(monthIndex).padStart(2, '0')}-01`);
                    const endOfMonth = new Date(startOfMonth);
                    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                    dateFilter = { purchasedAt: { $gte: startOfMonth, $lt: endOfMonth } };
                }
                else {
                    dateFilter = { purchasedAt: { $gte: new Date(`${filterYear}-01-01`), $lt: new Date(`${filterYear + 1}-01-01`) } };
                }
                report = yield purchased_model_1.PurchasedCourseModel.aggregate([
                    {
                        $match: Object.assign({ mentorIdObject }, dateFilter)
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userDetails"
                        }
                    },
                    {
                        $lookup: {
                            from: "courses",
                            localField: "courseId",
                            foreignField: "_id",
                            as: "courseDetails"
                        }
                    },
                    {
                        $unwind: "$userDetails"
                    },
                    {
                        $unwind: "$courseDetails"
                    },
                    {
                        $project: {
                            _id: 0,
                            username: "$userDetails.username",
                            coursename: "$courseDetails.courseName",
                            price: 1,
                            purchasedAt: 1,
                            transactionId: 1
                        }
                    }
                ]);
                salesCount = report.length;
                return {
                    report: report,
                    salesCount: salesCount
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorRepository;
