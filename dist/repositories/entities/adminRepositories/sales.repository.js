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
const mentor_model_1 = __importDefault(require("../../../models/mentor.model"));
const purchased_model_1 = require("../../../models/purchased.model");
const uploadCourse_model_1 = require("../../../models/uploadCourse.model");
const user_model_1 = __importDefault(require("../../../models/user.model"));
const date_fns_1 = require("date-fns");
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class AdminSalesRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            Purchased: purchased_model_1.PurchasedCourseModel,
            User: user_model_1.default,
            Mentor: mentor_model_1.default,
            Course: uploadCourse_model_1.CourseModel
        });
    }
    adminDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
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
                const revenueStats = yield this.aggregate('Purchased', [
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
                const getUsers = yield this.findAll('User', { isBlocked: false }).countDocuments().exec();
                const getMentors = yield this.findAll('Mentor', { isBlocked: false }).countDocuments().exec();
                // 📌 2️⃣ Course Performance Stats
                const courses = yield this.findAll('Course');
                const totalCourses = courses.length;
                //enrollment data calculations
                const categoryWiseEnrollments = yield this.aggregate('Purchased', [
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
                const mostEnrolledCategory = categoryWiseEnrollments.length > 0 ? categoryWiseEnrollments[0] : null;
                const leastEnrolledCategory = categoryWiseEnrollments.length > 0 ? categoryWiseEnrollments[categoryWiseEnrollments.length - 1] : null;
                let mostEnrolledCourse = [];
                let leastEnrolledCourse = [];
                if (mostEnrolledCategory) {
                    mostEnrolledCourse = yield this.aggregate('Purchased', [
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
                }
                if (leastEnrolledCategory) {
                    leastEnrolledCourse = yield this.aggregate('Purchased', [
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
                }
                const enrollmentResult = {
                    mostEnrolledCategory: mostEnrolledCategory
                        ? {
                            categoryName: mostEnrolledCategory.categoryName,
                            enrollments: mostEnrolledCategory.totalEnrollments,
                            course: ((_a = mostEnrolledCourse[0]) === null || _a === void 0 ? void 0 : _a.courseName) || "No Course",
                        }
                        : { categoryName: "No Data", enrollments: 0, course: "No Course" },
                    leastEnrolledCategory: leastEnrolledCategory
                        ? {
                            categoryName: leastEnrolledCategory.categoryName,
                            enrollments: leastEnrolledCategory.totalEnrollments,
                            course: ((_b = leastEnrolledCourse[0]) === null || _b === void 0 ? void 0 : _b.courseName) || "No Course",
                        }
                        : { categoryName: "No Data", enrollments: 0, course: "No Course" },
                };
                const totalStudents = yield this.findAll('Purchased').countDocuments();
                const activeStudents = yield this.findAll('Purchased').countDocuments({
                    "completedChapters.completedAt": { $gte: (0, date_fns_1.subMonths)(new Date(), 1) }
                });
                const totalCompletedCourses = yield this.findAll('Purchased').countDocuments({
                    isCourseCompleted: true
                });
                const courseCompletionRate = totalStudents > 0 ? Math.floor((totalCompletedCourses / totalStudents) * 100) : 0;
                // 📌 4️⃣ Sales & Revenue Trends (Last 6 Months)
                const salesTrends = yield this.aggregate('Purchased', [
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
                const topCourses = yield this.aggregate('Purchased', [
                    { $group: { _id: "$courseId", revenue: { $sum: "$price" }, enrollments: { $sum: 1 } } },
                    { $sort: { revenue: -1 } },
                    { $limit: 5 }
                ]);
                return {
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
                    // Student Engagement
                    totalStudents,
                    activeStudents,
                    courseCompletionRate,
                    // Sales Trends
                    salesTrends,
                    // Top Performing Courses
                    topCourses
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminChartGraph(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                courseSales = yield this.aggregate('Purchased', [
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
                const revenueOrders = yield this.aggregate('Purchased', [
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
                return {
                    year: filterYear,
                    courseSales: courseSales,
                    revenue: revenue, // Revenue is now grouped by month
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    adminSalesReport(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                report = yield this.aggregate('Purchased', [
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
                return {
                    report: report,
                    salesCount: salesCount
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AdminSalesRepository;
