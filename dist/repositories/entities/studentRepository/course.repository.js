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
const purchased_model_1 = require("../../../models/purchased.model");
const uploadCourse_model_1 = require("../../../models/uploadCourse.model");
const chapter_model_1 = require("../../../models/chapter.model");
const mongoose_1 = __importDefault(require("mongoose"));
const mentorWallet_model_1 = require("../../../models/mentorWallet.model");
const adminWallet_model_1 = require("../../../models/adminWallet.model");
const quizz_model_1 = __importDefault(require("../../../models/quizz.model"));
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class StudentCourseRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            PurchasedCourse: purchased_model_1.PurchasedCourseModel,
            Course: uploadCourse_model_1.CourseModel,
            Chapter: chapter_model_1.ChapterModel,
            MentorWallet: mentorWallet_model_1.MentorWalletModel,
            AdminWallet: adminWallet_model_1.AdminWalletModel,
            Quiz: quizz_model_1.default
        });
    }
    studentGetAllCourses(pageNumber, limitNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (pageNumber - 1) * limitNumber;
                // Get the Query object first (no `await` yet)
                const getAllCourse = yield this.findAll("Course", { isPublished: true, isListed: true, approved: true })
                    .populate({
                    path: 'categoryId', // Reference to the Category model
                    match: { isListed: true }, // Ensure the category is listed
                    select: 'isListed categoryName', // Select relevant fields from the Category model
                })
                    .skip(skip)
                    .limit(limitNumber)
                    .sort({ createdAt: -1 })
                    .exec();
                console.log('getAll  ', getAllCourse);
                console.log('getAll lenth ', getAllCourse.length);
                // Count total courses
                const query = yield this.findAll('Course', { isPublished: true, isListed: true, approved: true })
                    .populate({
                    path: 'categoryId', // Reference to the Category model
                    match: { isListed: true }, // Ensure the category is listed
                    select: 'isListed categoryName', // Select relevant fields from the Category model
                });
                // console.log('query ', query)
                const filteredCourses = getAllCourse.filter((course) => { var _a; return (_a = course === null || course === void 0 ? void 0 : course.categoryId) === null || _a === void 0 ? void 0 : _a.isListed; });
                const courses = query === null || query === void 0 ? void 0 : query.filter((course) => { var _a; return (_a = course === null || course === void 0 ? void 0 : course.categoryId) === null || _a === void 0 ? void 0 : _a.isListed; });
                const totalCourses = courses.length;
                // Count documents
                // const totalCourses = await query.clone().countDocuments();
                // const totalCourses = await this.models.Course.countDocuments({ isPublished: true, isListed: true, approved: true });
                if (!getAllCourse || getAllCourse.length === 0) {
                    throw new Error("Courses Not Found");
                }
                return {
                    courses: filteredCourses,
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
                    approved: true
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
                console.log('query ', query);
                const filteredCourse = yield this.findAll("Course", query)
                    .populate({
                    path: 'categoryId', // Reference to the Category model
                    match: { isListed: true }, // Ensure the category is listed
                    select: 'isListed categoryName', // Select relevant fields from the Category model
                })
                    .skip(skip)
                    .limit(limitNumber)
                    .sort({ createdAt: -1 });
                console.log('filteredCouse: ', filteredCourse);
                // Filter courses to exclude those with unlisted categories
                const filteredCourses = filteredCourse.filter((course) => { var _a; return (_a = course === null || course === void 0 ? void 0 : course.categoryId) === null || _a === void 0 ? void 0 : _a.isListed; });
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
    studentGetCourse(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log('courseId: ', courseId);
                console.log('studentId: ', studentId);
                const getCourse = yield this.findById('Course', courseId)
                    .populate({
                    path: 'fullVideo.chapterId',
                    model: 'Chapter',
                    select: 'chapterTitle description',
                });
                console.log('getCourse: ', getCourse);
                const chaptersData = (_a = getCourse === null || getCourse === void 0 ? void 0 : getCourse.fullVideo) === null || _a === void 0 ? void 0 : _a.map((video) => video.chapterId);
                if (studentId !== '') {
                    const AlreadPurchased = yield this.findOne('PurchasedCourse', { userId: studentId, courseId: getCourse === null || getCourse === void 0 ? void 0 : getCourse._id });
                    if (AlreadPurchased) {
                        return {
                            course: getCourse,
                            alreadyBuyed: 'Already Buyed',
                            chapters: chaptersData
                        };
                    }
                }
                console.log('entered');
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
    studentGetCoursePlay(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const isCourse = yield this.findOne('PurchasedCourse', { courseId, userId: studentId });
                if (!isCourse) {
                    const error = new Error('Courses Not Found');
                    error.name = 'CoursesNotFound';
                    throw error;
                }
                const findCourse = yield this.findById('Course', courseId)
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
                console.log('enter 1');
                const course = yield this.findById('Course', courseId);
                const mentorId = course === null || course === void 0 ? void 0 : course.mentorId;
                const findChapters = yield this.findAll('Chapter', { courseId: courseId });
                if (findChapters.length === 0) {
                    const error = new Error('Chapters Not Found');
                    error.name = "Chapters Not Found";
                    throw error;
                }
                console.log('enter 2');
                const completedChapters = findChapters.map((chapter) => ({
                    chapterId: chapter._id,
                    isCompleted: false,
                }));
                // const purchasedCourse = {
                //     userId,
                //     courseId,
                //     mentorId,
                //     transactionId: txnid,
                //     completedChapters,
                //     isCourseCompleted: false,
                //     price: Number(amount)
                // }
                const purchasedCourse = {
                    userId: new mongoose_1.default.Types.ObjectId(userId), // ✅ Correct
                    courseId: new mongoose_1.default.Types.ObjectId(courseId), // ✅ Correct
                    mentorId: mentorId ? new mongoose_1.default.Types.ObjectId(String(mentorId)) : undefined, // Convert if not undefined
                    transactionId: String(txnid),
                    completedChapters,
                    isCourseCompleted: false,
                    price: Number(amount),
                };
                const createdCourse = yield this.createData('PurchasedCourse', purchasedCourse);
                console.log('createdCourse : ', createdCourse);
                //Mentor Payment And Admin Commission for Purchase To their Wallet
                // const courseName = course?.courseName as string
                // Calculate the 90% for mentor and 10% for admin
                // const mentorAmount = (Number(amount) * 90) / 100;
                // const adminCommission = (Number(amount) * 10) / 100;
                // const mentorWallet = await this.findById('MentorWallet', String(mentorId));
                // if (mentorWallet) {
                //     mentorWallet.balance += Number(mentorAmount);
                //     mentorWallet.transactions.push({
                //         type: "credit",
                //         amount: Number(mentorAmount),
                //         date: new Date(),
                //         courseName,
                //         adminCommission: `${adminCommission.toFixed(2)} (10%)`,
                //     });
                //     await mentorWallet.save();
                // } else {
                //     // Create a new wallet if it doesn't exist
                //     await MentorWalletModel.create({
                //         mentorId,
                //         balance: Number(mentorAmount),
                //         transactions: [
                //             {
                //                 type: "credit",
                //                 amount: Number(mentorAmount),
                //                 date: new Date(),
                //                 courseName,
                //                 adminCommission: `${adminCommission.toFixed(2)} (10%)`,
                //             },
                //         ],
                //     });
                // }
                // // Add 10% to admin's wallet
                // const adminWallet = await this.findById('AdminWallet', "admin");
                // if (adminWallet) {
                //     adminWallet.balance += Number(adminCommission);
                //     adminWallet.transactions.push({
                //         type: "credit",
                //         amount: Number(adminCommission),
                //         date: new Date(),
                //         courseName,
                //     });
                //     await adminWallet.save();
                // } else {
                //     // Create a new wallet if it doesn't exist
                //     await AdminWalletModel.create({
                //         adminId: "admin",
                //         balance: Number(adminCommission),
                //         transactions: [
                //             {
                //                 type: "credit",
                //                 amount: Number(adminCommission),
                //                 date: new Date(),
                //                 courseName,
                //             },
                //         ],
                //     });
                // }
                return createdCourse;
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
                const getCourses = yield this.findAll('PurchasedCourse', { userId: studentId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(4)
                    .populate("courseId", "courseName level")
                    .exec();
                const findCourses = yield this.findAll('PurchasedCourse', { userId: studentId });
                const totalCourses = findCourses.length;
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
    studentCoursePlay(purchaseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // const purchasedCourse = await this.findById('PurchasedCourse', purchaseId)
                const purchasedCourse = yield this.findOne('PurchasedCourse', { _id: purchaseId, userId: studentId })
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
                if (!purchasedCourse) {
                    return {
                        purchasedCourse: {},
                        course: {
                            courseName: '',
                            duration: '',
                            level: '',
                            description: '',
                            category: '',
                            thumbnailUrl: '',
                        },
                        chapters: [],
                    };
                }
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
    studentChapterVideoEnd(chapterId, studiedTime, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('chapterId ', chapterId);
                const findChapter = yield this.findOne('PurchasedCourse', {
                    userId: studentId,
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
    studentCompleteCourse(studentId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const completeCourse = yield this.findOne('PurchasedCourse', { userId: studentId, courseId })
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
    studentQuizz(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isPurchased = yield this.findOne('PurchasedCourse', { courseId, userId: studentId });
                if (!isPurchased) {
                    return {
                        _id: '',
                        courseId: '',
                        questions: [],
                    };
                }
                const getQuizz = yield this.findOne('Quiz', { courseId });
                return getQuizz;
            }
            catch (error) {
                throw error;
            }
        });
    }
    studentCheckAlreadyBuyed(courseId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const purchasedCourse = yield this.findOne('PurchasedCourse', {
                    courseId,
                    userId: studentId,
                });
                if (!purchasedCourse) {
                    return null;
                }
                return purchasedCourse;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = StudentCourseRepository;
