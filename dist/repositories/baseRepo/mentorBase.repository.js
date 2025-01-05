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
class MentorBaseRepository {
    constructor(model) {
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
                const { username, phone } = data;
                const response = yield this.model.findByIdAndUpdate(id, { username, phone }, { new: true });
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
    getAllCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.find().sort({ createdAt: -1 }).exec();
                return response;
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
}
exports.default = MentorBaseRepository;
