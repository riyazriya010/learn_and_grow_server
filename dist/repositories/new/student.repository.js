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
const certificate_model_1 = require("../../models/certificate.model");
const chapter_model_1 = require("../../models/chapter.model");
const purchased_model_1 = require("../../models/purchased.model");
const quizz_model_1 = __importDefault(require("../../models/quizz.model"));
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
                    transactionId: txnid,
                    completedChapters,
                    isCourseCompleted: false,
                    price: amount
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
                    .limit(limitNumber)
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
                const findChapter = yield purchased_model_1.PurchasedCourseModel.findOne({
                    "completedChapters.chapterId": chapterId
                });
                const chapterIndex = findChapter.completedChapters.findIndex((chapter) => chapter.chapterId.toString() === chapterId);
                findChapter.completedChapters[chapterIndex].isCompleted = true;
                const updatedChapters = yield findChapter.save();
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
                const getCertificates = yield certificate_model_1.CertificateModel.find({ userId: studentId });
                return getCertificates;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentRepository;
