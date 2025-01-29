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
const categroy_model_1 = require("../../models/categroy.model");
const chapter_model_1 = require("../../models/chapter.model");
const chatRooms_model_1 = require("../../models/chatRooms.model");
const mentor_model_1 = __importDefault(require("../../models/mentor.model"));
const messages_model_1 = require("../../models/messages.model");
const quizz_model_1 = __importDefault(require("../../models/quizz.model"));
const uploadCourse_model_1 = require("../../models/uploadCourse.model");
const mentorWallet_model_1 = require("../../models/mentorWallet.model");
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
    mentorChatGetRooms(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getRooms = yield chatRooms_model_1.ChatRoomsModel
                    .find({ mentorId })
                    .populate({
                    path: 'studentId',
                    select: 'username profilePicUrl'
                })
                    .populate({
                    path: 'mentorId',
                    select: 'username'
                });
                const formatted = yield Promise.all(getRooms.map((data) => __awaiter(this, void 0, void 0, function* () {
                    // Find the corresponding room for the mentor
                    const getRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ studentId: data.studentId });
                    return {
                        lastMessage: getRoom === null || getRoom === void 0 ? void 0 : getRoom.lastMessage,
                        studentData: data.studentId,
                        mentorData: data.mentorId,
                    };
                })));
                return formatted;
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
    mentorGetMessages(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield messages_model_1.MessageModel.find({ roomId });
                if ((message === null || message === void 0 ? void 0 : message.length) === 0) {
                    const error = new Error('Messages Not Found');
                    error.name = "MessageNotFound";
                    throw error;
                }
                return message;
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorSaveMessage(message, roomId, receiverId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('save repo');
                const lastMessage = yield chatRooms_model_1.ChatRoomsModel.findById(roomId);
                lastMessage.lastMessage = message;
                yield lastMessage.save();
                console.log('last message saved');
                const newMessage = new messages_model_1.MessageModel({
                    senderId: senderId,
                    receiverId: receiverId,
                    roomId: roomId,
                    message: message,
                    senderModel: 'Mentors',
                    receiverModel: 'User'
                });
                const savedMessage = yield newMessage.save();
                console.log('message saved ', savedMessage);
                return savedMessage;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = MentorRepository;
