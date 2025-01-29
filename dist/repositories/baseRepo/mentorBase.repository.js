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
const nodemailer_1 = __importDefault(require("../../integration/nodemailer"));
const mailToken_1 = require("../../integration/mailToken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const uploadCourse_model_1 = require("../../models/uploadCourse.model");
const categroy_model_1 = require("../../models/categroy.model");
class MentorBaseRepository {
    constructor(model) {
        this.courseModel = uploadCourse_model_1.CourseModel;
        this.categoryModel = categroy_model_1.CategoryModel;
        this.model = model;
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({ email: email });
        });
    }
    mentorSignUp(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modifiedData = Object.assign(Object.assign({}, data), { role: 'mentor' });
                const document = new this.model(modifiedData);
                const savedUser = yield document.save();
                const mail = new nodemailer_1.default();
                const token = yield (0, mailToken_1.generateAccessToken)({ id: savedUser.id, email: data.email });
                const portLink = process.env.MENTOR_PORT_LINK;
                if (!portLink) {
                    throw new Error('PORT_LINK environment variable is not set');
                }
                const createdLink = `${portLink}?token=${token}`;
                mail.sendMentorVerificationEmail(data.email, createdLink)
                    .then(info => {
                    console.log('Verification email sent successfully:');
                })
                    .catch(error => {
                    console.error('Failed to send verification email:', error);
                });
                return savedUser;
            }
            catch (error) {
                console.log(error.message);
                return null;
            }
        });
    }
    mentorLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUser = yield this.model.findOne({ email: email }).lean().exec();
                if (!getUser) {
                    return null;
                }
                const isPassword = yield bcrypt_1.default.compare(password, getUser.password);
                if (!isPassword) {
                    return null;
                }
                return getUser;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    forgetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = data;
                const isUser = yield this.model.findOne({ email: email }).exec();
                if (!isUser) {
                    return null;
                }
                const user = isUser;
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                user.password = hashedPassword;
                const updatedUser = yield user.save();
                return updatedUser;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    mentorGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.model.findOne({ email: email });
            return response;
        });
    }
    mentorGoogleSignUp(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            const mentorData = {
                username: displayName,
                email,
                phone: 'Not Provided',
                expertise: 'Not Provided',
                skills: 'Not Provided',
                password: 'null',
                role: 'mentor',
                isVerified: true
            };
            const document = new this.model(mentorData);
            const savedUser = yield document.save();
            return savedUser;
        });
    }
    profileUpdate(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, phone, profilePicUrl } = data;
                // Prepare data to update
                const updateData = {
                    username,
                    phone,
                };
                // Only add profilePicUrl to the updateData if it exists
                if (profilePicUrl) {
                    updateData.profilePicUrl = profilePicUrl;
                }
                // Perform the update
                const response = yield this.model.findByIdAndUpdate(id, updateData, { new: true });
                return response;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    checkStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findById(id);
                const user = response;
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    isUserBlocked(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findOne({ email: email });
                const user = response;
                if (user.isBlocked) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyMentor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const findMentor = yield this.model.findOne({ email: email }).exec();
            if (!findMentor) {
                console.error('Mentor not found:', email); // Debug log
                return null;
            }
            console.log('Found Mentor before update:', findMentor); // Debug log
            const mentor = findMentor;
            // Update the user verification status
            mentor.isVerified = true;
            // Save the updated document
            const updatedMentor = yield mentor.save();
            console.log('Updated Mentor after verification:', updatedMentor);
            return updatedMentor;
        });
    }
    mentorReVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.model.findOne({ email: email });
                if (!userData) {
                    return null;
                }
                const token = yield (0, mailToken_1.generateAccessToken)({ id: userData.id, email: email });
                const portLink = process.env.MENTOR_PORT_LINK;
                if (!portLink) {
                    throw new Error('PORT_LINK environment variable is not set');
                }
                const createdLink = `${portLink}?token=${token}`;
                const mail = new nodemailer_1.default();
                mail.sendMentorVerificationEmail(email, createdLink)
                    .then(info => {
                    console.log('Verification email sent successfully:');
                })
                    .catch(error => {
                    console.error('Failed to send verification email:', error);
                });
                return userData;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    isBlocked(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findById(id);
                const user = response;
                if (user.isBlocked) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    isVerified(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findById(id);
                const user = response;
                if (user.isVerified) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*------------------------------- WEEK -2 -------------------------*/
    addCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCategory = yield this.categoryModel.findOne({ categoryName: data.category });
                data.categoryId = findCategory._id;
                const isExist = yield this.model.findOne({ courseName: data.courseName });
                if (isExist) {
                    const error = new Error('Already Exist');
                    error.name = 'AlreadyExist';
                    throw error;
                }
                const response = yield this.model.create(data);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    editCourse(courseId, updatedFields) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = yield this.model.findOne({
                    courseName: updatedFields.courseName,
                    _id: { $ne: courseId }
                });
                if (isExist) {
                    const error = new Error('Already Exist');
                    error.name = 'AlreadyExist';
                    throw error;
                }
                const response = yield this.model.findByIdAndUpdate(courseId, updatedFields, { new: true });
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    unPublishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('men base repo: ', courseId);
                const updatedCourse = yield this.model.findByIdAndUpdate(courseId, { isPublished: false }, { new: true });
                console.log('upd ', updatedCourse);
                if (!updatedCourse) {
                    return;
                }
                return updatedCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    publishCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCourse = yield this.model.findByIdAndUpdate(courseId, { isPublished: true }, { new: true });
                if (!updatedCourse) {
                    return;
                }
                return updatedCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    filterCourse() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 4, searchTerm) {
            try {
                console.log('filters: ', searchTerm);
                const skip = (page - 1) * limit;
                const query = {};
                if (searchTerm !== 'undefined') {
                    query.courseName = { $regex: searchTerm, $options: 'i' };
                }
                const courses = yield this.model.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
                const totalCourses = yield this.model.countDocuments(query);
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
    getAllCourses() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 4, userId) {
            try {
                const skip = (page - 1) * limit;
                const response = yield this.model
                    .find({ mentorId: userId })
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                const totalCourses = yield this.model.countDocuments();
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
                // const response = await this.model.find().sort({ createdAt: -1 }).exec()
                // return response
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findById(courseId);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAllCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.find();
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    editChapter(title, description, chapterId, location) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate input
                if (!title || !description || !chapterId) {
                    throw new Error("Title, description, and chapterId are required");
                }
                const data = {
                    chapterTitle: title,
                    description,
                };
                if (location) {
                    data.videoUrl = location;
                }
                const updatedChapter = yield this.model.findByIdAndUpdate(chapterId, { $set: data }, { new: true });
                if (!updatedChapter) {
                    throw new Error("Chapter not found");
                }
                const updatedCourse = yield this.courseModel.updateOne({ "fullVideo.chapterId": chapterId }, { $set: { "fullVideo.$[elem].chapterId": updatedChapter._id } }, { arrayFilters: [{ "elem.chapterId": chapterId }] });
                if (!updatedCourse || updatedCourse.modifiedCount === 0) {
                    console.warn("No course updated for the given chapterId");
                }
                return updatedChapter;
            }
            catch (error) {
                console.error("Error updating chapter:", error.message);
                throw error;
            }
        });
    }
    getAllChapters(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.find({
                    courseId: courseId
                });
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    addQuizz(data, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findQuizz = yield this.model.findOne({ courseId: courseId });
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
                    // If quiz exists for the course, push the new question into the questions array
                    findQuizz.questions.push(questionData);
                    yield findQuizz.save();
                    return findQuizz;
                }
                else {
                    // If no quiz exists for the course, create a new quiz document
                    const newQuizz = yield this.model.create({ courseId: courseId, questions: [questionData] });
                    return newQuizz;
                }
            }
            catch (error) {
                // console.error('Error in base repository layer:', error);
                throw error;
            }
        });
    }
    getAllQuizz(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.find({
                    courseId: courseId
                });
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteQuizz(courseId, quizId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findQuizz = yield this.model.findOne({ courseId: courseId });
                if (findQuizz) {
                    // Convert quizId to an ObjectId for proper comparison
                    const objectIdQuizId = new mongoose_1.default.Types.ObjectId(quizId);
                    findQuizz.questions = findQuizz.questions.filter((question) => !question._id.equals(objectIdQuizId) // Use .equals for ObjectId comparison
                    );
                    const updatedQuizz = yield findQuizz.save();
                    console.log('Updated Quizz:', updatedQuizz);
                    return updatedQuizz;
                }
                else {
                    throw new Error('Quiz not found for the given courseId');
                }
            }
            catch (error) {
                console.error('Error in deleteQuizz:', error);
                throw error;
            }
        });
    }
    getWallet(mentorId_1) {
        return __awaiter(this, arguments, void 0, function* (mentorId, pageNumber = 1, limitNumber = 4) {
            try {
                const skip = (pageNumber - 1) * limitNumber;
                // Fetch paginated wallet data for the mentor
                const response = yield this.model
                    .find({ mentorId }) // Filter by mentorId
                    .sort({ createdAt: -1 }) // Sort by creation date, descending
                    .skip(skip)
                    .limit(limitNumber)
                    .select("-__v"); // Exclude the `__v` field if unnecessary
                // Count total wallet documents for the mentor
                const totalWallets = yield this.model.countDocuments({ mentorId });
                return {
                    wallets: response, // Renamed to `wallets` for better readability
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalWallets / limitNumber),
                    totalWallets,
                };
            }
            catch (error) {
                // Improved error handling with additional debug info
                console.error("Error in getWallet:", error.message);
                throw error;
            }
        });
    }
}
exports.default = MentorBaseRepository;
