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
const user_model_1 = __importDefault(require("../../models/user.model"));
const mailToken_1 = require("../../integration/mailToken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("../../integration/nodemailer"));
const purchased_model_1 = require("../../models/purchased.model");
const userWallet_model_1 = require("../../models/userWallet.model");
const mentorWallet_model_1 = require("../../models/mentorWallet.model");
const adminWallet_model_1 = require("../../models/adminWallet.model");
class BaseRepository {
    constructor(model) {
        this.userWalletModel = userWallet_model_1.UserWalletModel;
        this.mentorWalletModel = mentorWallet_model_1.MentorWalletModel;
        this.adminWalletModel = adminWallet_model_1.AdminWalletModel;
        this.userModel = user_model_1.default;
        this.purchasedCourseModel = purchased_model_1.PurchasedCourseModel;
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
    signupStudent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, phone, password } = data;
                const existUser = yield this.userModel.findOne({ email: email });
                if (existUser) {
                    const error = new Error('User Already Exist');
                    error.name = 'UserAlreadyExit';
                    throw error;
                }
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
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'UserAlreadyExit') {
                        throw error;
                    }
                }
                throw error;
            }
        });
    }
    studentGoogleSignIn(email, displayName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existUser = yield this.userModel.findOne({ email: email });
                if (existUser) {
                    const error = new Error('User Already Exist');
                    error.name = 'UserAlreadyExit';
                    throw error;
                }
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
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'UserAlreadyExit') {
                        throw error;
                    }
                }
                throw error;
            }
        });
    }
    studentGoogleLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existUser = yield this.model.findOne({ email: email });
                if (!existUser) {
                    const error = new Error('User Not Found');
                    error.name = 'UserNotFound';
                    throw error;
                }
                if ((existUser === null || existUser === void 0 ? void 0 : existUser.isBlocked) === true) {
                    const error = new Error('User Blocked');
                    error.name = 'UserBlocked';
                    throw error;
                }
                return existUser;
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.name === 'UserNotFound' || error.name === 'UserBlocked') {
                        throw error;
                    }
                }
                throw error;
            }
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
    getAllCourses() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 6) {
            try {
                console.log('page ', page);
                console.log('limit ', limit);
                // const skip = (page - 1) * limit;
                // // Query to fetch courses with isPublished, isListed, and categories that are also isListed
                // const response = await this.model
                //     .find({
                //         isPublished: true,
                //         isListed: true
                //     })
                //     .populate({
                //         path: 'categoryId', // Reference to the Category model
                //         match: { isListed: true }, // Ensure the category is listed
                //         select: 'isListed categoryName', // Select relevant fields from Category
                //     })
                //     .skip(skip)
                //     .limit(limit)
                //     .sort({ createdAt: -1 }) as unknown as ICourse[]
                // const filteredCourses = response.filter(course => course.categoryId);
                // const totalCourses = filteredCourses.length;
                // if (filteredCourses.length === 0) {
                //     const error = new Error('Courses Not Found');
                //     error.name = 'CoursesNotFound';
                //     throw error;
                // }
                // return {
                //     courses: filteredCourses,
                //     currentPage: page,
                //     totalPages: Math.ceil(totalCourses / limit),
                //     totalCourses: totalCourses
                // };
                const skip = (page - 1) * limit;
                const response = yield this.model
                    .find({ isPublished: true, isListed: true })
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
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCourse(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCourse = yield this.model.findById(id);
                if (!findCourse) {
                    const error = new Error('Course Not Found');
                    error.name = 'Course Not Found';
                    throw error;
                }
                if (userId) {
                    const purchasedCourse = yield this.purchasedCourseModel.findOne({ userId: userId, courseId: findCourse._id });
                    if (purchasedCourse) {
                        return {
                            findCourse,
                            alreadyBuyed: 'Already Buyed'
                        };
                    }
                    return findCourse;
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
                const response = yield this.model.findById(id)
                    .populate('fullVideo.chapterId');
                if (!response) {
                    const error = new Error('Courses Not Found');
                    error.name = 'CoursesNotFound';
                    throw error;
                }
                const res = response;
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
                // Base query with isPublished and isListed checks
                const query = {
                    isPublished: true,
                    isListed: true,
                };
                // Adding filters for selectedCategory, selectedLevel, and searchTerm
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
                // Fetch courses with the specified conditions
                const response = yield this.model
                    .find(query)
                    .populate({
                    path: 'categoryId', // Reference to the Category model
                    match: { isListed: true }, // Ensure the category is listed
                    select: 'isListed categoryName', // Select relevant fields from the Category model
                })
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 });
                // Filter courses to exclude those with unlisted categories
                const filteredCourses = response.filter((course) => course.categoryId);
                const totalCourses = filteredCourses.length;
                if (filteredCourses.length === 0) {
                    const error = new Error('Course Not Found');
                    error.name = 'CourseNotFound';
                    throw error;
                }
                return {
                    courses: filteredCourses,
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
    //  this is for buying course
    findCourseById(courseId, amount, courseName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the course by its ID and populate mentor details
                const isCourse = yield this.model
                    .findById(courseId)
                    .populate("mentorId", "name email");
                if (!isCourse) {
                    throw new Error("Course not found");
                }
                // Extract mentorId and courseName from the course
                const mentorId = isCourse.mentorId;
                const courseName = isCourse.courseName;
                // Calculate the 90% for mentor and 10% for admin
                const mentorAmount = (amount * 90) / 100;
                const adminCommission = (amount * 10) / 100;
                // Add 90% to mentor's wallet
                const mentorWallet = yield this.mentorWalletModel.findOne({ mentorId });
                if (mentorWallet) {
                    mentorWallet.balance += Number(mentorAmount);
                    mentorWallet.transactions.push({
                        type: "credit",
                        amount: Number(mentorAmount),
                        date: new Date(),
                        courseName,
                        adminCommission: `${adminCommission.toFixed(2)} (10%)`,
                    });
                    yield mentorWallet.save();
                }
                else {
                    // Create a new wallet if it doesn't exist
                    yield this.mentorWalletModel.create({
                        mentorId,
                        balance: Number(mentorAmount),
                        transactions: [
                            {
                                type: "credit",
                                amount: Number(mentorAmount),
                                date: new Date(),
                                courseName,
                                adminCommission: `${adminCommission.toFixed(2)} (10%)`,
                            },
                        ],
                    });
                }
                // Add 10% to admin's wallet
                const adminWallet = yield this.adminWalletModel.findOne({ adminId: "admin" });
                if (adminWallet) {
                    adminWallet.balance += Number(adminCommission);
                    adminWallet.transactions.push({
                        type: "credit",
                        amount: Number(adminCommission),
                        date: new Date(),
                        courseName,
                    });
                    yield adminWallet.save();
                }
                else {
                    // Create a new wallet if it doesn't exist
                    yield this.adminWalletModel.create({
                        adminId: "admin",
                        balance: Number(adminCommission),
                        transactions: [
                            {
                                type: "credit",
                                amount: Number(adminCommission),
                                date: new Date(),
                                courseName,
                            },
                        ],
                    });
                }
                // Return the full course details
                // return {
                //     success: true,
                //     message: "Amount distributed successfully",
                //     course: isCourse,
                // };
                // const isCourse = await this.model.findById(courseId)
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
    getBuyedCourses(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, page = 1, limit = 4) {
            try {
                const skip = (page - 1) * limit;
                // Fetch the courses with pagination and populate course details
                const response = yield this.model
                    .find({ userId: userId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate("courseId", "courseName level")
                    .exec();
                // Count the total number of courses for the user
                const totalCourses = yield this.model.countDocuments({ userId: userId });
                // Check if no courses are found
                // if (!response || response.length === 0) {
                //     const error = new Error("No courses found for the user.");
                //     error.name = "CoursesNotFound";
                //     throw error;
                // }
                // Return the paginated data
                return {
                    courses: response,
                    currentPage: page,
                    totalPages: Math.ceil(totalCourses / limit),
                    totalCourses: totalCourses,
                };
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
    getQuizz(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findQuizz = yield this.model.findOne({ courseId: courseId });
                if (findQuizz) {
                    return findQuizz;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    completeCourse(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findCourse = yield this.model.findOne({ userId, courseId })
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
                if (findCourse.isCourseCompleted) {
                    return 'Course Already Completed';
                }
                findCourse.isCourseCompleted = true;
                const courseData = findCourse.courseId;
                const updatedCourse = yield findCourse.save();
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
    createCertificate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, username, courseName, mentorName, courseId } = data;
                // Create and save certificate
                const certificate = new this.model({
                    userId,
                    userName: username,
                    courseName,
                    mentorName,
                    courseId,
                });
                const savedCertificate = yield certificate.save();
                return savedCertificate;
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCertificates(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.find({ userId: userId });
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = BaseRepository;
