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
const express_1 = __importDefault(require("express"));
// import session from 'express-session'
const constants_1 = require("./utils/constants");
const morgan_1 = __importDefault(require("morgan"));
const database_1 = require("./config/database");
const cors_1 = __importDefault(require("cors"));
const students_routes_1 = __importDefault(require("./routes/students.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mentors_routes_1 = __importDefault(require("./routes/mentors.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const uploadCourse_model_1 = require("./models/uploadCourse.model");
const chapter_model_1 = require("./models/chapter.model");
const purchased_model_1 = require("./models/purchased.model");
// import userRouter from './routes/user.routes'
const app = (0, express_1.default)();
(0, database_1.connectDB)();
const origin = 'http://localhost:3000';
const corsOptions = {
    // origin: FRONTEND_URL() || "*",
    // origin: origin || "*",
    origin: [
        "http://localhost:3000",
        "http://localhost:8001",
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true
};
// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//   }))
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// app.use(express.json())
// app.use(express.urlencoded({extended: true}))
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
app.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('entered');
        const courseId = '67710140df708808ce0fd712';
        const userId = '676a9f2a339270ae95450b75';
        const course = yield uploadCourse_model_1.CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found', success: false });
        }
        console.log('course got it');
        const chapters = yield chapter_model_1.ChapterModel.find({ courseId });
        if (chapters.length === 0) {
            return res.status(404).json({ message: 'No chapters found for this course', success: false });
        }
        console.log('chapter for course got it');
        const completedChapters = chapters.map((chapter) => ({
            chapterId: chapter._id,
            isCompleted: false,
        }));
        const purchasedCourse = new purchased_model_1.PurchasedCourseModel({
            userId,
            courseId,
            completedChapters,
            isCourseCompleted: false,
        });
        console.log('purchase model created');
        yield purchasedCourse.save();
        console.log('purchase saved');
        return res.send('Purchase done');
    }
    catch (error) {
        next(error); // Passes the error to the global error handler
    }
}));
// Global error handler (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', success: false });
});
// Get course details endpoint
app.get('/course-details/:userId/:courseId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, courseId } = req.params;
    try {
        // Fetching purchased course data
        const purchasedCourse = yield purchased_model_1.PurchasedCourseModel.findOne({ userId, courseId });
        if (!purchasedCourse) {
            return res.status(404).json({ message: 'Purchased course not found', success: false });
        }
        // Fetching the course details from CourseModel
        const course = yield uploadCourse_model_1.CourseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found', success: false });
        }
        // Fetching the chapters for the course
        const chapters = yield chapter_model_1.ChapterModel.find({ courseId });
        if (!chapters.length) {
            return res.status(404).json({ message: 'No chapters found for this course', success: false });
        }
        // Map chapters to include completion status
        const updatedChapters = chapters.map((chapter) => {
            const completedChapter = purchasedCourse.completedChapters.find((completed) => completed.chapterId === chapter._id);
            return Object.assign(Object.assign({}, chapter.toObject()), { isCompleted: (completedChapter === null || completedChapter === void 0 ? void 0 : completedChapter.isCompleted) || false });
        });
        // Combine and send the response
        const responseData = {
            course,
            chapters: updatedChapters,
            purchasedCourse,
        };
        return res.status(200).json(responseData);
    }
    catch (error) {
        console.error('Error fetching course data:', error);
        return res.status(500).json({ message: 'An error occurred while fetching course data', success: false });
    }
}));
app.patch('/api/complete-chapter/:chapterId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chapterId } = req.params;
    const { isCompleted } = req.body; // Expecting { isCompleted: boolean }
    try {
        // Find the chapter in the purchased course
        const purchasedCourse = yield purchased_model_1.PurchasedCourseModel.findOne({
            'completedChapters.chapterId': chapterId, // Check if the chapter exists in the purchased course
        });
        if (!purchasedCourse) {
            return res.status(404).json({ message: 'Purchased course not found', success: false });
        }
        // Find the specific chapter and update its completion status
        const chapterIndex = purchasedCourse.completedChapters.findIndex((chapter) => chapter.chapterId.toString() === chapterId);
        if (chapterIndex === -1) {
            return res.status(404).json({ message: 'Chapter not found in purchased course', success: false });
        }
        // Update the completion status
        purchasedCourse.completedChapters[chapterIndex].isCompleted = isCompleted;
        // Save the updated purchased course
        yield purchasedCourse.save();
        // Respond with success
        return res.status(200).json({ message: 'Chapter completion updated', success: true });
    }
    catch (error) {
        console.error('Error updating chapter completion:', error);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
}));
app.use("/api/user-service", students_routes_1.default);
app.use("/api/mentor-service", mentors_routes_1.default);
app.use("/api/admin-service", admin_routes_1.default);
app.listen(constants_1.PORT, () => {
    console.log(`Server is running on ${constants_1.PORT}`);
});
