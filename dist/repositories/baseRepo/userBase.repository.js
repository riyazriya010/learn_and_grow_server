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
const mailToken_1 = require("../../integration/mailToken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("../../integration/nodemailer"));
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.find();
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            // Using lean() to return plain JavaScript objects instead of Mongoose Document
            const foundUser = yield this.model.findOne(query).lean().exec();
            if (!foundUser) {
                return null;
            }
            return foundUser;
        });
    }
    findUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.model.find().exec(); // No .lean() used
            if (!users || users.length === 0) {
                return null;
            }
            return users; // Returns Mongoose documents
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne({ email });
        });
    }
    signupStudent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, phone, password } = data;
            const modifiedUser = {
                username,
                email,
                phone,
                password,
                role: 'student',
                studiedHours: 0,
            };
            const document = new this.model(modifiedUser);
            const savedUser = yield document.save();
            const token = yield (0, mailToken_1.generateAccessToken)({ id: savedUser.id, email: email });
            const portLink = process.env.STUDENT_PORT_LINK;
            if (!portLink) {
                throw new Error('PORT_LINK environment variable is not set');
            }
            const createdLink = `${portLink}?token=${token}`;
            const mail = new nodemailer_1.default();
            mail.sendVerificationEmail(email, createdLink)
                .then(info => {
                console.log('Verification email sent successfully:');
            })
                .catch(error => {
                console.error('Failed to send verification email:', error);
            });
            return savedUser;
        });
    }
    studentGoogleSignIn(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = {
                username: displayName,
                email,
                phone: 'Not Provided',
                studiedHours: 0,
                password: 'null',
                role: 'student',
                isVerified: true
            };
            const document = new this.model(userData);
            const savedUser = yield document.save();
            return savedUser;
        });
    }
    studentGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.model.findOne({ email: email });
            return response;
        });
    }
    studentLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield this.model.findOne({ email: email }).lean().exec();
            if (!getUser) {
                console.log('not get: ', getUser);
                return null;
            }
            console.log('get: ', getUser);
            const isPassword = yield bcrypt_1.default.compare(password, getUser.password);
            if (!isPassword) {
                console.log('is not pass');
                return null;
            }
            console.log('is Pass');
            return getUser;
        });
    }
    createOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    email,
                    otp
                };
                const document = new this.model(data);
                console.log(document);
                const savedOtp = yield document.save();
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.model.findByIdAndDelete(savedOtp._id);
                    console.log('otp deleted ', email);
                }), 60000);
                return savedOtp;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield this.model.findOne({ email: email }).exec();
            if (!findUser) {
                console.error('User not found:', email); // Debug log
                return null;
            }
            console.log('Found user before update:', findUser); // Debug log
            const user = findUser;
            // Update the user verification status
            user.isVerified = true;
            // Save the updated document
            const updatedUser = yield user.save();
            console.log('Updated user after verification:', updatedUser);
            return updatedUser;
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
                console.log('user: ', user);
                const updatedUser = yield user.save();
                console.log('user2');
                return updatedUser;
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
    studentReVerify(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield this.model.findOne({ email: email });
                if (!userData) {
                    return null;
                }
                const token = yield (0, mailToken_1.generateAccessToken)({ id: userData.id, email: email });
                const portLink = process.env.STUDENT_PORT_LINK;
                if (!portLink) {
                    throw new Error('PORT_LINK environment variable is not set');
                }
                const createdLink = `${portLink}?token=${token}`;
                const mail = new nodemailer_1.default();
                mail.sendVerificationEmail(email, createdLink)
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
    /* ------------------------------ WEEK - 2 -------------------------*/
    // async getAllCourses(): Promise<any> {
    //     try {
    //         const response = await this.model.find()
    //         if (!response || response.length === 0) {
    //             const error = new Error('Courses Not Found')
    //             error.name = 'CoursesNotFound'
    //             throw error
    //         }
    //         return response
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    getAllCourses() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 6) {
            try {
                // Calculate skip value for pagination
                const skip = (page - 1) * limit;
                // Fetch courses with pagination
                const response = yield this.model
                    .find() // Add any filtering if needed
                    .skip(skip)
                    .limit(limit);
                // Get the total count of courses for pagination
                const totalCourses = yield this.model.countDocuments();
                // If no courses found
                if (!response || response.length === 0) {
                    const error = new Error('Courses Not Found');
                    error.name = 'CoursesNotFound';
                    throw error;
                }
                // Return the paginated courses along with total information
                return {
                    courses: response,
                    currentPage: page,
                    totalPages: Math.ceil(totalCourses / limit),
                    totalCourses: totalCourses
                };
            }
            catch (error) {
                console.log(error);
                throw error; // Propagate error if needed
            }
        });
    }
    getCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCourse = yield this.model.findById(id);
                if (!findCourse) {
                    const error = new Error('Course Not Found');
                    error.name = 'Course Not Found';
                    throw error;
                }
                return findCourse;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getCoursePlay(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Fetch the course and populate the fullVideo.chapterId field
                const response = yield this.model.findById(id)
                    .populate('fullVideo.chapterId'); // Populate the chapterId field in fullVideo
                // If the course is not found, throw an error
                if (!response) {
                    const error = new Error('Courses Not Found');
                    error.name = 'CoursesNotFound';
                    throw error;
                }
                const res = response;
                // Extract the chapters from the populated fullVideo field
                const chapters = ((_a = res === null || res === void 0 ? void 0 : res.fullVideo) === null || _a === void 0 ? void 0 : _a.map((video) => video.chapterId)) || [];
                // Return the course data along with the populated chapters
                return {
                    course: response,
                    chapters,
                };
            }
            catch (error) {
                console.log(error);
                throw new Error("Error fetching course and chapters");
            }
        });
    }
    filterData() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 6, selectedCategory, selectedLevel, searchTerm) {
            try {
                console.log('filters: ', selectedCategory, selectedLevel, searchTerm);
                const skip = (page - 1) * limit;
                const query = {};
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
                const courses = yield this.model.find(query).skip(skip).limit(limit);
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
    findCourseById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isCourse = yield this.model.findById(courseId);
                return isCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
    findChaptersById(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isChapters = yield this.model.find({ courseId: courseId });
                return isChapters;
            }
            catch (error) {
                throw error;
            }
        });
    }
    buyCourse(userId, courseId, completedChapters, txnid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // find the course with course id if the course were there then
                // create a new docs in the purchasecourse model withi this id and userId
                const purchasedCourse = {
                    userId,
                    courseId,
                    completedChapters,
                    isCourseCompleted: false
                };
                const document = new this.model(purchasedCourse);
                const savedUser = yield document.save();
                return savedUser;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getBuyedCourses(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCourses = this.model.find({ userId: userId }).sort({ createdAt: -1 })
                    .populate('courseId', 'courseName level')
                    .exec();
                return findCourses;
            }
            catch (error) {
                throw error;
            }
        });
    }
    coursePlay(buyedId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Find the purchased course and populate course and chapters
                const purchasedCourse = yield this.model.findById(buyedId)
                    .populate({
                    path: 'courseId', // Populate course details
                    select: 'courseName duration level description category thumbnailUrl', // Select specific fields from Course
                    populate: {
                        path: 'fullVideo.chapterId', // Populate chapters from Course
                        model: 'Chapter', // Specify the Chapter model
                        select: 'chapterTitle courseId chapterNumber description videoUrl createdAt', // Select specific fields
                    },
                })
                    .exec();
                if (!purchasedCourse) {
                    throw new Error('Purchased course not found');
                }
                // Extract data
                const courseData = purchasedCourse.courseId;
                const chaptersData = (_a = courseData === null || courseData === void 0 ? void 0 : courseData.fullVideo) === null || _a === void 0 ? void 0 : _a.map((video) => video.chapterId);
                // Format the response
                return {
                    purchasedCourse, // All data from the purchased course
                    course: {
                        courseName: courseData === null || courseData === void 0 ? void 0 : courseData.courseName,
                        duration: courseData === null || courseData === void 0 ? void 0 : courseData.duration,
                        level: courseData === null || courseData === void 0 ? void 0 : courseData.level,
                        description: courseData === null || courseData === void 0 ? void 0 : courseData.description,
                        category: courseData === null || courseData === void 0 ? void 0 : courseData.category,
                        thumbnailUrl: courseData === null || courseData === void 0 ? void 0 : courseData.thumbnailUrl,
                    },
                    chapters: chaptersData, // All chapter data
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    chapterVideoEnd(chapterId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findChapter = yield this.model.findOne({
                    "completedChapters.chapterId": chapterId
                });
                if (!findChapter) {
                    return 'Purchased Course not Found';
                }
                const chapterIndex = findChapter.completedChapters.findIndex((chapter) => chapter.chapterId.toString() === chapterId);
                if (chapterIndex === -1) {
                    return `Chapter Not Found`;
                }
                findChapter.completedChapters[chapterIndex].isCompleted = true;
                const updatedChapters = yield findChapter.save();
                return updatedChapters;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCertificate(certificateId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCertificate = yield this.model.findById(certificateId);
                if (findCertificate) {
                    return findCertificate;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = BaseRepository;
