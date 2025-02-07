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
const adminBadge_model_1 = require("../../models/adminBadge.model");
const certificate_model_1 = require("../../models/certificate.model");
const chapter_model_1 = require("../../models/chapter.model");
const chatRooms_model_1 = require("../../models/chatRooms.model");
const mentor_model_1 = __importDefault(require("../../models/mentor.model"));
const messages_model_1 = require("../../models/messages.model");
const purchased_model_1 = require("../../models/purchased.model");
const quizz_model_1 = __importDefault(require("../../models/quizz.model"));
const studentBadges_model_1 = require("../../models/studentBadges.model");
const studentNotification_model_1 = require("../../models/studentNotification.model");
const uploadCourse_model_1 = require("../../models/uploadCourse.model");
const user_model_1 = __importDefault(require("../../models/user.model"));
// here we can access the data base
class StudentRepository {
    //////////////////////// WEEK - 1 ////////////////////////////////////
    studentLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield user_model_1.default.findOne({ email: email });
                return findUser;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw error;
                }
                throw error;
            }
        });
    }
    studentSignUp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existUser = yield user_model_1.default.findOne({ email: userData.email });
                if (existUser) {
                    const error = new Error('User Already Exist');
                    error.name = 'UserExist';
                    throw error;
                }
                const { username, email, phone, password } = userData;
                const modifiedUser = {
                    username,
                    email,
                    phone,
                    password,
                    role: 'student',
                    studiedHours: 0,
                };
                const newUser = new user_model_1.default(modifiedUser);
                yield newUser.save();
                return newUser;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw error;
                }
                throw error;
            }
        });
    }
    studentGoogleSignUp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existUser = yield user_model_1.default.findOne({ email: userData === null || userData === void 0 ? void 0 : userData.email });
                if (existUser) {
                    const error = new Error('User Already Exist');
                    error.name = 'UserExist';
                    throw error;
                }
                const modifiedUser = {
                    username: userData.displayName,
                    email: userData.email,
                    phone: 'Not Provided',
                    studiedHours: 0,
                    password: 'null',
                    role: 'student',
                    isVerified: true
                };
                const newUesr = new user_model_1.default(modifiedUser);
                yield newUesr.save();
                return newUesr;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw error;
                }
                throw error;
            }
        });
    }
    studentGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield user_model_1.default.findOne({ email: email });
                if (!findUser) {
                    const error = new Error('User Not Found');
                    error.name = 'UserNotFound';
                    throw error;
                }
                return findUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentForgetPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield user_model_1.default.findOne({ email: email });
                console.log('find ', findUser);
                if (!findUser) {
                    const error = new Error('User Not Found');
                    error.name = 'UserNotFound';
                    throw error;
                }
                findUser.password = password;
                yield findUser.save();
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield user_model_1.default.findOne({ email: email });
                if (!findUser) {
                    const error = new Error('User Not Found');
                    error.name = 'UserNotFound';
                    throw error;
                }
                findUser.isVerified = true;
                yield findUser.save();
                return findUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentProfleUpdate(studentId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateData = {
                    username: userData.username,
                    phone: userData.phone
                };
                if (userData.profilePicUrl) {
                    updateData.profilePicUrl = userData.profilePicUrl;
                }
                const updatedUser = yield user_model_1.default.findByIdAndUpdate(studentId, updateData, { new: true });
                return updatedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentReVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield user_model_1.default.findOne({ email: email });
                if (!findUser) {
                    const error = new Error('User Not Found');
                    error.name = 'UserNotFound';
                    throw error;
                }
                return findUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCheck(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield user_model_1.default.findById(studentId);
                return findUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    ////////////////////////////// WEEK - 2 //////////////////////////////
    studentGetCourse(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const getCourse = yield uploadCourse_model_1.CourseModel
                    .findById(courseId)
                    .populate({
                    path: 'fullVideo.chapterId',
                    model: 'Chapter',
                    select: 'chapterTitle description',
                });
                const chaptersData = (_a = getCourse === null || getCourse === void 0 ? void 0 : getCourse.fullVideo) === null || _a === void 0 ? void 0 : _a.map((video) => video.chapterId);
                if (studentId !== '') {
                    const AlreadPurchased = yield purchased_model_1.PurchasedCourseModel.findOne({ userId: studentId, courseId: getCourse === null || getCourse === void 0 ? void 0 : getCourse._id });
                    if (AlreadPurchased) {
                        return {
                            course: getCourse,
                            alreadyBuyed: 'Already Buyed',
                            chapters: chaptersData
                        };
                    }
                }
                return {
                    course: getCourse,
                    chapters: chaptersData
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetAllCourses(pageNumber, limitNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (pageNumber - 1) * limitNumber;
                const getAllCourse = yield uploadCourse_model_1.CourseModel
                    .find({ isPublished: true, isListed: true })
                    .skip(skip)
                    .limit(limitNumber)
                    .sort({ createdAt: -1 });
                const totalCourses = yield uploadCourse_model_1.CourseModel.countDocuments();
                if (!getAllCourse || getAllCourse.length === 0) {
                    const error = new Error('Courses Not Found');
                    error.name = 'CoursesNotFound';
                    throw error;
                }
                return {
                    courses: getAllCourse,
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalCourses / limitNumber),
                    totalCourses: totalCourses
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCourseFilterData(filterData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { pageNumber, limitNumber, selectedCategory, selectedLevel, searchTerm } = filterData;
                const skip = (pageNumber - 1) * limitNumber;
                // Base query with isPublished and isListed checks
                const query = {
                    isPublished: true,
                    isListed: true,
                };
                if (selectedCategory !== 'undefined') {
                    query.category = { $regex: `^${selectedCategory}$`, $options: 'i' };
                }
                if (selectedLevel !== 'undefined') {
                    query.level = { $regex: `^${selectedLevel}$`, $options: 'i' };
                }
                if (searchTerm !== 'undefined') {
                    console.log('search: ', searchTerm);
                    query.courseName = { $regex: searchTerm, $options: 'i' };
                }
                const filteredCourse = yield uploadCourse_model_1.CourseModel
                    .find(query)
                    .populate({
                    path: 'categoryId', // Reference to the Category model
                    match: { isListed: true }, // Ensure the category is listed
                    select: 'isListed categoryName', // Select relevant fields from the Category model
                })
                    .skip(skip)
                    .limit(limitNumber)
                    .sort({ createdAt: -1 });
                // Filter courses to exclude those with unlisted categories
                const filteredCourses = filteredCourse.filter((course) => course.categoryId);
                const totalCourses = filteredCourses.length;
                if (filteredCourses.length === 0) {
                    const error = new Error('Course Not Found');
                    error.name = 'CourseNotFound';
                    throw error;
                }
                return {
                    courses: filteredCourses,
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalCourses / limitNumber),
                    totalCourses,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetCoursePlay(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const findCourse = yield uploadCourse_model_1.CourseModel
                    .findById(courseId)
                    .populate("fullVideo.chapterId");
                if (!findCourse) {
                    const error = new Error('Courses Not Found');
                    error.name = 'CoursesNotFound';
                    throw error;
                }
                const courseData = findCourse;
                const chapters = ((_a = courseData === null || courseData === void 0 ? void 0 : courseData.fullVideo) === null || _a === void 0 ? void 0 : _a.map((video) => video === null || video === void 0 ? void 0 : video.chapterId)) || [];
                return {
                    course: findCourse,
                    chapters
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentBuyCourse(purchaseData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, courseId, txnid, amount } = purchaseData;
                const course = yield uploadCourse_model_1.CourseModel.findById(courseId);
                const mentorId = course === null || course === void 0 ? void 0 : course.mentorId;
                const findChapters = yield chapter_model_1.ChapterModel.find({ courseId: courseId });
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
                    userId,
                    courseId,
                    mentorId,
                    transactionId: txnid,
                    completedChapters,
                    isCourseCompleted: false,
                    price: Number(amount)
                };
                const document = new purchased_model_1.PurchasedCourseModel(purchasedCourse);
                const savedUser = yield document.save();
                return savedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentBuyedCourses(studentId, pageNumber, limitNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (pageNumber - 1) * limitNumber;
                const getCourses = yield purchased_model_1.PurchasedCourseModel
                    .find({ userId: studentId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(4)
                    .populate("courseId", "courseName level")
                    .exec();
                const totalCourses = yield purchased_model_1.PurchasedCourseModel.countDocuments({ userId: studentId });
                return {
                    courses: getCourses,
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalCourses / limitNumber),
                    totalCourses: totalCourses,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCoursePlay(purchaseId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const purchasedCourse = yield purchased_model_1.PurchasedCourseModel
                    .findById(purchaseId)
                    .populate({
                    path: 'courseId',
                    select: 'courseName duration level description category thumbnailUrl',
                    populate: {
                        path: 'fullVideo.chapterId',
                        model: 'Chapter',
                        select: 'chapterTitle courseId chapterNumber description videoUrl createdAt',
                    },
                })
                    .exec();
                const courseData = purchasedCourse.courseId;
                const chaptersData = (_a = courseData === null || courseData === void 0 ? void 0 : courseData.fullVideo) === null || _a === void 0 ? void 0 : _a.map((video) => video.chapterId);
                return {
                    purchasedCourse,
                    course: {
                        courseName: courseData === null || courseData === void 0 ? void 0 : courseData.courseName,
                        duration: courseData === null || courseData === void 0 ? void 0 : courseData.duration,
                        level: courseData === null || courseData === void 0 ? void 0 : courseData.level,
                        description: courseData === null || courseData === void 0 ? void 0 : courseData.description,
                        category: courseData === null || courseData === void 0 ? void 0 : courseData.category,
                        thumbnailUrl: courseData === null || courseData === void 0 ? void 0 : courseData.thumbnailUrl,
                    },
                    chapters: chaptersData,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentChapterVideoEnd(chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('id: ', chapterId);
                const findChapter = yield purchased_model_1.PurchasedCourseModel.findOne({
                    "completedChapters.chapterId": chapterId
                });
                console.log('found chap ', findChapter);
                const chapterIndex = findChapter.completedChapters.findIndex((chapter) => chapter.chapterId.toString() === chapterId);
                findChapter.completedChapters[chapterIndex].isCompleted = true;
                const updatedChapters = yield findChapter.save();
                console.log('upd ', updatedChapters);
                return updatedChapters;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGeCerfiticate(certificateId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCertificate = yield certificate_model_1.CertificateModel.findById(certificateId);
                return findCertificate;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCompleteCourse(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const completeCourse = yield purchased_model_1.PurchasedCourseModel.findOne({ userId, courseId })
                    .populate({
                    path: 'courseId',
                    select: 'courseName',
                    populate: {
                        path: 'mentorId',
                        model: 'Mentors',
                        select: 'username'
                    }
                })
                    .exec();
                if (completeCourse.isCourseCompleted) {
                    const error = new Error('Course Already Completed');
                    error.name = "CourseAlreadyCompleted";
                    throw error;
                }
                completeCourse.isCourseCompleted = true;
                const courseData = completeCourse.courseId;
                const updatedCourse = yield completeCourse.save();
                const mentor = (courseData === null || courseData === void 0 ? void 0 : courseData.mentorId) || { username: null };
                return {
                    updatedCourse,
                    courseName: courseData === null || courseData === void 0 ? void 0 : courseData.courseName,
                    mentorName: mentor.username,
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentQuizz(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getQuizz = yield quizz_model_1.default.findOne({ courseId });
                return getQuizz;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCreateCertificate(certificateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId, studentName, courseName, mentorName, courseId } = certificateData;
                const certificate = new certificate_model_1.CertificateModel({
                    userId: studentId,
                    userName: studentName,
                    courseName,
                    mentorName,
                    courseId,
                });
                const savedCertificate = yield certificate.save();
                //creating badge for student
                const findBadge = yield adminBadge_model_1.BadgeManagementModel.findOne({ badgeName: 'Completion Badge' });
                const createBadge = new studentBadges_model_1.BadgeModel({
                    userId: studentId,
                    badgeId: findBadge === null || findBadge === void 0 ? void 0 : findBadge._id
                });
                yield createBadge.save();
                return savedCertificate;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetAllCertificates(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCertificates = yield certificate_model_1.CertificateModel.find({ userId: studentId }).sort({ issuedDate: -1 });
                return getCertificates;
            }
            catch (error) {
                throw error;
            }
        });
    }
    ////////////////////////////////// WEEK - 3 //////////////////////////////////
    studentChatGetMentors(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUsers = yield purchased_model_1.PurchasedCourseModel.find({ userId: studentId })
                    .populate({
                    path: "mentorId",
                    select: "_id username profilePicUrl"
                });
                const uniqueMentors = new Set();
                const formatted = [];
                for (const data of getUsers) {
                    const mentor = data.mentorId;
                    if (mentor && !uniqueMentors.has(mentor._id.toString())) {
                        uniqueMentors.add(mentor._id.toString());
                        const getRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({
                            studentId,
                            mentorId: mentor._id,
                        });
                        formatted.push({
                            mentorsData: Object.assign(Object.assign({}, mentor.toObject()), { lastMessage: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.lastMessage) || null, userMsgCount: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.userMsgCount) || 0, updatedAt: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.updatedAt) || new Date(0) }),
                            updatedAt: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.updatedAt) || new Date(0),
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
    studentCreateRoom(studentId, mentorId) {
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
    studentSaveMessage(studentId, mentorId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ studentId, mentorId });
                findRoom.lastMessage = message;
                findRoom.mentorMsgCount += 1;
                yield findRoom.save();
                const data = {
                    senderId: studentId,
                    receiverId: mentorId,
                    roomId: findRoom === null || findRoom === void 0 ? void 0 : findRoom._id,
                    message: message,
                    senderModel: "User",
                    receiverModel: "Mentors"
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
    studentGetMessages(studentId, mentorId) {
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
    studentDeleteEveryOne(messageId) {
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
    studentDeleteForMe(messageId) {
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
                        chatRoom.lastMessage = ''; // No valid messages left
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
    studentResetCount(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ studentId, mentorId });
                findRoom.userMsgCount = 0;
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
    ///// Notification
    studentCreateNotification(username, senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    senderId,
                    receiverId,
                    senderName: username
                };
                const createNotification = new studentNotification_model_1.StudentNotificationModel(data);
                yield createNotification.save();
                console.log('created noti');
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetNotifications(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch notifications sorted by createdAt (newest first)
                const allNotifications = yield studentNotification_model_1.StudentNotificationModel
                    .find({ receiverId: studentId })
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
    studentGetNotificationsCount(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getNotification = yield studentNotification_model_1.StudentNotificationModel.find({ receiverId: studentId, seen: false }).countDocuments();
                return { count: getNotification };
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetNotificationsSeen() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const markSeen = yield studentNotification_model_1.StudentNotificationModel.updateMany({ seen: false }, { $set: { seen: true } });
                return markSeen;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentDeleteNotifications(senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteMessage = yield studentNotification_model_1.StudentNotificationModel.deleteMany({ senderId });
                return deleteMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentGetMentor(studentId, mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findMentor = yield mentor_model_1.default.findById(mentorId).select("_id username profilePicUrl");
                // Fetch the chat room for this student and mentor
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
    studentGetBadges(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findBadges = yield studentBadges_model_1.BadgeModel.find({ userId: studentId })
                    .populate({
                    path: "badgeId",
                    select: "badgeName description value"
                })
                    .sort({ createdAt: -1 });
                return findBadges;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentRepository;
