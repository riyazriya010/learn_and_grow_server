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
const constants_1 = require("./utils/constants");
const morgan_1 = __importDefault(require("morgan"));
const database_1 = require("./config/database");
const cors_1 = __importDefault(require("cors"));
const students_routes_1 = __importDefault(require("./routes/students.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mentors_routes_1 = __importDefault(require("./routes/mentors.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const body_parser_1 = __importDefault(require("body-parser"));
// import "./integration/userReminderTask"
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const purchased_model_1 = require("./models/purchased.model");
const date_fns_1 = require("date-fns");
const uploadCourse_model_1 = require("./models/uploadCourse.model");
const chapter_model_1 = require("./models/chapter.model");
const user_model_1 = __importDefault(require("./models/user.model"));
const mentor_model_1 = __importDefault(require("./models/mentor.model"));
// import { startOfDay, endOfDay, subDays, subMonths, subYears } from 'date-fns';
const app = (0, express_1.default)();
///////////////////////////////chat
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Role'],
        credentials: true
    }
});
//////////////////////////
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
// admin side
//dashboard
app.get('/get/admin/dashboard', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
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
        //Active Users & Mentors
        const getUsers = yield user_model_1.default.find({ isBlocked: false }).countDocuments().exec();
        const getMentors = yield mentor_model_1.default.find({ isBlocked: false }).countDocuments().exec();
        // 📌 2️⃣ Course Performance Stats
        const courses = yield uploadCourse_model_1.CourseModel.find();
        const totalCourses = courses.length;
        //enrollment data calculations
        const categoryWiseEnrollments = yield purchased_model_1.PurchasedCourseModel.aggregate([
            {
                $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "courseDetails",
                },
            },
            { $unwind: "$courseDetails" },
            {
                $lookup: {
                    from: "categories",
                    localField: "courseDetails.categoryId",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            { $unwind: "$categoryDetails" },
            {
                $group: {
                    _id: "$categoryDetails._id",
                    categoryName: { $first: "$categoryDetails.categoryName" },
                    totalEnrollments: { $sum: 1 },
                },
            },
            { $sort: { totalEnrollments: -1 } },
        ]);
        const mostEnrolledCategory = categoryWiseEnrollments[0];
        const leastEnrolledCategory = categoryWiseEnrollments[categoryWiseEnrollments.length - 1];
        const mostEnrolledCourse = yield purchased_model_1.PurchasedCourseModel.aggregate([
            {
                $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "courseDetails",
                },
            },
            { $unwind: "$courseDetails" },
            {
                $match: { "courseDetails.categoryId": mostEnrolledCategory._id },
            },
            {
                $group: {
                    _id: "$courseId",
                    courseName: { $first: "$courseDetails.courseName" },
                    enrollments: { $sum: 1 },
                },
            },
            { $sort: { enrollments: -1 } },
            { $limit: 1 },
        ]);
        const leastEnrolledCourse = yield purchased_model_1.PurchasedCourseModel.aggregate([
            {
                $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "courseDetails",
                },
            },
            { $unwind: "$courseDetails" },
            {
                $match: { "courseDetails.categoryId": leastEnrolledCategory._id },
            },
            {
                $group: {
                    _id: "$courseId",
                    courseName: { $first: "$courseDetails.courseName" },
                    enrollments: { $sum: 1 },
                },
            },
            { $sort: { enrollments: 1 } },
            { $limit: 1 },
        ]);
        const enrollmentResult = {
            mostEnrolledCategory: {
                categoryName: mostEnrolledCategory.categoryName,
                enrollments: mostEnrolledCategory.totalEnrollments,
                course: ((_a = mostEnrolledCourse[0]) === null || _a === void 0 ? void 0 : _a.courseName) || "No Course",
            },
            leastEnrolledCategory: {
                categoryName: leastEnrolledCategory.categoryName,
                enrollments: leastEnrolledCategory.totalEnrollments,
                course: ((_b = leastEnrolledCourse[0]) === null || _b === void 0 ? void 0 : _b.courseName) || "No Course",
            },
        };
        const totalStudents = yield purchased_model_1.PurchasedCourseModel.countDocuments();
        const activeStudents = yield purchased_model_1.PurchasedCourseModel.countDocuments({
            "completedChapters.completedAt": { $gte: (0, date_fns_1.subMonths)(new Date(), 1) }
        });
        const totalCompletedCourses = yield purchased_model_1.PurchasedCourseModel.countDocuments({
            isCourseCompleted: true
        });
        const courseCompletionRate = totalStudents > 0 ? Math.floor((totalCompletedCourses / totalStudents) * 100) : 0;
        // 📌 4️⃣ Sales & Revenue Trends (Last 6 Months)
        const salesTrends = yield purchased_model_1.PurchasedCourseModel.aggregate([
            {
                $match: {
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
            { $group: { _id: "$courseId", revenue: { $sum: "$price" }, enrollments: { $sum: 1 } } },
            { $sort: { revenue: -1 } },
            { $limit: 5 }
        ]);
        return res.status(200).send({
            message: "Dashboard Data Retrieved",
            success: true,
            result: {
                // Revenue Overview
                todayRevenue: ((_c = revenueStats[0]) === null || _c === void 0 ? void 0 : _c.todayRevenue) || 0,
                prevMonthRevenue: ((_d = revenueStats[0]) === null || _d === void 0 ? void 0 : _d.prevMonthRevenue) || 0,
                prevYearRevenue: ((_e = revenueStats[0]) === null || _e === void 0 ? void 0 : _e.prevYearRevenue) || 0,
                totalRevenue: ((_f = revenueStats[0]) === null || _f === void 0 ? void 0 : _f.totalRevenue) || 0,
                //Active Users and Mentors
                getUsers,
                getMentors,
                // Course Performance
                totalCourses,
                mostEnrolledCourse: enrollmentResult.mostEnrolledCategory,
                leastEnrolledCourse: enrollmentResult.leastEnrolledCategory,
                // mostEnrolledCourse: mostEnrolledCourse.length ? mostEnrolledCourse[0] : "N/A",
                // leastEnrolledCourse: leastEnrolledCourse.length ? leastEnrolledCourse[0] : "N/A",
                // Student Engagement
                totalStudents,
                activeStudents,
                courseCompletionRate,
                // Sales Trends
                salesTrends,
                // Top Performing Courses
                topCourses
            }
        });
    }
    catch (error) {
        console.error('Error on server dashboard', error);
        return res.status(500).send({
            message: "Server Error",
            success: false,
            error: error.message
        });
    }
}));
app.get('/get/admin/chart/graph/data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Filters:', req.query);
        const filters = req.query.filter ? JSON.parse(req.query.filter) : {};
        const { year, month, date } = filters;
        const currentYear = new Date().getFullYear();
        const filterYear = year ? parseInt(year) : currentYear;
        let courseSales = [];
        let revenue = [];
        let matchFilter = {};
        let selectedMonth = null;
        if (date) {
            const specificDate = new Date(date);
            selectedMonth = specificDate.getMonth() + 1;
            const startOfDay = new Date(specificDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(specificDate.setHours(23, 59, 59, 999));
            matchFilter = { purchasedAt: { $gte: startOfDay, $lt: endOfDay } };
        }
        else if (month) {
            selectedMonth = new Date(`${month} 1, 2022`).getMonth() + 1;
            const startOfMonth = new Date(`${filterYear}-${String(selectedMonth).padStart(2, '0')}-01`);
            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);
            matchFilter = { purchasedAt: { $gte: startOfMonth, $lt: endOfMonth } };
        }
        else {
            matchFilter = {
                purchasedAt: {
                    $gte: new Date(`${filterYear}-01-01`),
                    $lt: new Date(`${filterYear + 1}-01-01`),
                },
            };
        }
        // Aggregate course sales by category
        courseSales = yield purchased_model_1.PurchasedCourseModel.aggregate([
            { $match: matchFilter },
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'courseDetails',
                },
            },
            { $unwind: '$courseDetails' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'courseDetails.categoryId',
                    foreignField: '_id',
                    as: 'categoryDetails',
                },
            },
            { $unwind: '$categoryDetails' },
            {
                $group: {
                    _id: '$categoryDetails._id',
                    categoryName: { $first: '$categoryDetails.categoryName' },
                    totalSales: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    categoryName: 1,
                    totalSales: 1,
                },
            },
        ]);
        let totalPurchases = courseSales.reduce((sum, category) => sum + category.totalSales, 0);
        courseSales = courseSales.map(category => ({
            categoryName: category.categoryName,
            percentage: totalPurchases > 0 ? ((category.totalSales / totalPurchases) * 100).toFixed(2) : '0.00',
        }));
        if (courseSales.length === 0) {
            courseSales = [{ categoryName: 'No sales data', percentage: '0.00' }];
        }
        // Aggregate revenue data by month
        const revenueOrders = yield purchased_model_1.PurchasedCourseModel.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: { month: { $month: '$purchasedAt' } }, // Group by month
                    totalRevenue: { $sum: '$price' },
                    totalOrders: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id.month',
                    totalRevenue: 1,
                    totalOrders: 1,
                },
            },
            { $sort: { month: 1 } }, // Ensure results are sorted by month
        ]);
        if (revenueOrders.length > 0) {
            revenue = revenueOrders.map(item => ({
                month: item.month,
                totalRevenue: item.totalRevenue,
                totalOrders: item.totalOrders,
            }));
        }
        return res.status(200).send({
            message: 'Course sales data fetched successfully',
            success: true,
            result: {
                year: filterYear,
                courseSales: courseSales,
                revenue: revenue, // Revenue is now grouped by month
            },
        });
    }
    catch (error) {
        console.error('Error fetching chart/graph data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
//sales report
app.get('/get/admin/report', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = req.query.filter ? JSON.parse(req.query.filter) : {};
        console.log('filters ', filters);
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
                $match: Object.assign({}, dateFilter)
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
                $lookup: {
                    from: "categories", // Lookup from the categories collection
                    localField: "courseDetails.categoryId", // Reference categoryId from courseDetails
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            {
                $unwind: "$categoryDetails"
            },
            {
                $project: {
                    _id: 0,
                    username: "$userDetails.username",
                    coursename: "$courseDetails.courseName",
                    categoryName: "$categoryDetails.categoryName",
                    price: 1,
                    purchasedAt: 1,
                    transactionId: 1
                }
            }
        ]);
        salesCount = report.length; // Total sales count based on filtered data
        return res.status(200).send({
            message: 'Mentor Report Retrieved',
            success: true,
            result: {
                report: report,
                salesCount: salesCount
            }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error", success: false });
    }
}));
app.get('/get/non-approved/courses', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req ', req.query);
        const { page = 1, limit = 1 } = req.query;
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;
        const getCourses = yield uploadCourse_model_1.CourseModel
            .find({ approved: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)
            .exec();
        const totalCourses = yield uploadCourse_model_1.CourseModel.countDocuments();
        return res.status(200).send({
            message: 'Not Approved Course Got It',
            success: true,
            result: {
                courses: getCourses,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalCourses / limitNumber),
                totalCourses: totalCourses,
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}));
app.get('/get/non-approved/course-details', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { courseId } = req.query;
        const getChapters = yield chapter_model_1.ChapterModel.find({ courseId }).exec();
        console.log('getchap ', getChapters);
        return res.status(200).send({
            message: 'Chapter Got It',
            success: true,
            result: getChapters
        });
    }
    catch (error) {
        console.log(error);
    }
}));
/////
// socket //
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });
    socket.on('sendMessage', (data) => {
        console.log('data ', data);
        const { receiverId, roomId, message } = data;
        // Emit to all users in the room except the sender
        io.to(roomId).emit('receiveMessage', message);
        // to update the chatlist of student and mentor
        socket.broadcast.emit('notify');
        socket.broadcast.emit('notifyMentor');
        // io.emit("notification",  'Notify from Server' );
        // this is for navbar
        socket.broadcast.emit("chatNotify", receiverId);
        socket.broadcast.emit("mentorChatNotify", receiverId);
    });
    //deleteMessage
    socket.on("deleteNotify", () => {
        socket.broadcast.emit("deletedMessage");
    });
    //online indicating
    socket.on('onlineUser', userId => {
        socket.broadcast.emit('updateOnline', userId);
    });
    // Chat Typing.....
    socket.on('studentTyping', (data) => {
        io.to(data.roomId).emit('studentTyping', { userId: data.userId });
    });
    socket.on('studentsStopTyping', (data) => {
        io.to(data.roomId).emit('studentStopTyping', { userId: data.userId });
    });
    socket.on('mentorTyping', (data) => {
        io.to(data.roomId).emit('mentorTyping', { userId: data.userId });
    });
    socket.on('mentorsStopTyping', (data) => {
        io.to(data.roomId).emit('mentorStopTyping', { userId: data.userId });
    });
    //Mentor Course Uploaded
    socket.on('courseUploaded', courseName => {
        io.emit('courseNotify', courseName);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
// Global error handler (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', success: false });
});
app.use("/api/user-service", students_routes_1.default);
app.use("/api/mentor-service", mentors_routes_1.default);
app.use("/api/admin-service", admin_routes_1.default);
server.listen(constants_1.PORT, () => {
    console.log(`Server is running on ${constants_1.PORT}`);
});
