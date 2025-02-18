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
const mongoose_1 = require("mongoose");
const date_fns_1 = require("date-fns");
const purchased_model_1 = require("../../../models/purchased.model");
const uploadCourse_model_1 = require("../../../models/uploadCourse.model");
const commonBaseRepository_1 = __importDefault(require("../../baseRepositories/commonBaseRepository"));
class MentorSalesRepository extends commonBaseRepository_1.default {
    constructor() {
        super({
            Purchased: purchased_model_1.PurchasedCourseModel,
            Course: uploadCourse_model_1.CourseModel
        });
    }
    mentorDashboard(mentorId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const mentorObjectId = new mongoose_1.Types.ObjectId(mentorId);
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
                            mentorId: mentorObjectId,
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
                // 📌 2️⃣ Course Performance Stats
                const courses = yield this.findAll('Course', { mentorId: mentorObjectId });
                const totalCourses = courses.length;
                const mostEnrolledCourse = yield this.aggregate('Purchased', [
                    { $match: { mentorId: mentorObjectId } },
                    { $group: { _id: "$courseId", enrollments: { $sum: 1 } } },
                    { $sort: { enrollments: -1 } },
                    { $limit: 1 },
                    {
                        $lookup: {
                            from: "courses",
                            localField: "_id",
                            foreignField: "_id",
                            as: "courseDetails",
                        },
                    },
                    { $unwind: "$courseDetails" },
                    {
                        $project: {
                            _id: 1,
                            enrollments: 1,
                            courseName: "$courseDetails.courseName",
                        },
                    },
                ]);
                const leastEnrolledCourse = yield this.aggregate('Purchased', [
                    { $match: { mentorId: mentorObjectId } },
                    { $group: { _id: "$courseId", enrollments: { $sum: 1 } } },
                    { $sort: { enrollments: 1 } },
                    { $limit: 1 },
                    {
                        $lookup: {
                            from: "courses",
                            localField: "_id",
                            foreignField: "_id",
                            as: "courseDetails",
                        },
                    },
                    { $unwind: "$courseDetails" },
                    {
                        $project: {
                            _id: 1,
                            enrollments: 1,
                            courseName: "$courseDetails.courseName",
                        },
                    },
                ]);
                // 📌 3️⃣ Student Engagement Stats
                const totalStudents = yield this.findAll('Purchased', { mentorId: mentorObjectId }).countDocuments();
                const activeStudents = yield this.findAll('Purchased', {
                    mentorId: mentorObjectId,
                    "completedChapters.completedAt": { $gte: (0, date_fns_1.subMonths)(new Date(), 1) }
                }).countDocuments();
                const totalCompletedCourses = yield this.findAll('Purchased', {
                    mentorId: mentorObjectId,
                    isCourseCompleted: true
                }).countDocuments();
                const courseCompletionRate = totalStudents > 0 ? Math.floor((totalCompletedCourses / totalStudents) * 100) : 0;
                // 📌 4️⃣ Sales & Revenue Trends (Last 6 Months)
                const salesTrends = yield this.aggregate('Purchased', [
                    {
                        $match: {
                            mentorId: mentorObjectId,
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
                    { $match: { mentorId: mentorObjectId } },
                    { $group: { _id: "$courseId", revenue: { $sum: "$price" }, enrollments: { $sum: 1 } } },
                    { $sort: { revenue: -1 } },
                    { $limit: 5 }
                ]);
                return {
                    // Revenue Overview
                    todayRevenue: ((_a = revenueStats[0]) === null || _a === void 0 ? void 0 : _a.todayRevenue) || 0,
                    prevMonthRevenue: ((_b = revenueStats[0]) === null || _b === void 0 ? void 0 : _b.prevMonthRevenue) || 0,
                    prevYearRevenue: ((_c = revenueStats[0]) === null || _c === void 0 ? void 0 : _c.prevYearRevenue) || 0,
                    totalRevenue: ((_d = revenueStats[0]) === null || _d === void 0 ? void 0 : _d.totalRevenue) || 0,
                    // Course Performance
                    totalCourses,
                    mostEnrolledCourse: mostEnrolledCourse.length ? mostEnrolledCourse[0] : "N/A",
                    leastEnrolledCourse: leastEnrolledCourse.length ? leastEnrolledCourse[0] : "N/A",
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
    mentorChartGraph(mentorId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('chart mentorId: ', mentorId);
                const mentorIdObject = new mongoose_1.Types.ObjectId(mentorId);
                const { year, month, date } = filters;
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth() + 1;
                const filterYear = year ? parseInt(year) : currentYear;
                // Default empty arrays for courseSales and revenueOrders
                let courseSales = [];
                let revenueOrders = [];
                // If the date is provided, filter for the specific date
                if (date) {
                    const specificDate = new Date(date);
                    const startOfDay = new Date(specificDate.setHours(0, 0, 0, 0));
                    const endOfDay = new Date(specificDate.setHours(23, 59, 59, 999));
                    courseSales = yield this.aggregate('Purchased', [
                        {
                            $match: {
                                mentorId: mentorIdObject,
                                purchasedAt: { $gte: startOfDay, $lt: endOfDay },
                            }
                        },
                        {
                            $group: {
                                _id: "$courseId",
                                totalSales: { $sum: 1 }
                            }
                        },
                        {
                            $lookup: {
                                from: "courses",
                                localField: "_id",
                                foreignField: "_id",
                                as: "courseDetails"
                            }
                        },
                        { $unwind: "$courseDetails" },
                        {
                            $project: {
                                _id: 0,
                                courseName: "$courseDetails.courseName",
                                totalSales: 1
                            }
                        }
                    ]);
                    let totalPurchases = courseSales.reduce((sum, course) => sum + course.totalSales, 0);
                    courseSales = courseSales.map(course => ({
                        courseName: course.courseName,
                        percentage: totalPurchases > 0 ? ((course.totalSales / totalPurchases) * 100).toFixed(2) : "0.00"
                    }));
                    if (courseSales.length === 0) {
                        courseSales = [{ courseName: "No sales data", percentage: "0.00" }];
                    }
                    revenueOrders = yield this.aggregate('Purchased', [
                        {
                            $match: {
                                mentorId: mentorIdObject,
                                purchasedAt: { $gte: startOfDay, $lt: endOfDay },
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalRevenue: { $sum: "$price" },
                                totalOrders: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                totalRevenue: 1,
                                totalOrders: 1,
                                _id: 0
                            }
                        }
                    ]);
                }
                // If year and month are provided, filter by year and month
                else if (month) {
                    const monthIndex = new Date(`${month} 1, 2022`).getMonth() + 1;
                    const startOfMonth = new Date(`${filterYear}-${String(monthIndex).padStart(2, '0')}-01`);
                    const endOfMonth = new Date(startOfMonth);
                    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                    courseSales = yield this.aggregate('Purchased', [
                        {
                            $match: {
                                mentorId: mentorIdObject,
                                purchasedAt: { $gte: startOfMonth, $lt: endOfMonth },
                            }
                        },
                        {
                            $group: {
                                _id: "$courseId",
                                totalSales: { $sum: 1 }
                            }
                        },
                        {
                            $lookup: {
                                from: "courses",
                                localField: "_id",
                                foreignField: "_id",
                                as: "courseDetails"
                            }
                        },
                        { $unwind: "$courseDetails" },
                        {
                            $project: {
                                _id: 0,
                                courseName: "$courseDetails.courseName",
                                totalSales: 1
                            }
                        }
                    ]);
                    let totalPurchases = courseSales.reduce((sum, course) => sum + course.totalSales, 0);
                    courseSales = courseSales.map(course => ({
                        courseName: course.courseName,
                        percentage: totalPurchases > 0 ? ((course.totalSales / totalPurchases) * 100).toFixed(2) : "0.00"
                    }));
                    if (courseSales.length === 0) {
                        courseSales = [{ courseName: "No sales data", percentage: "0.00" }];
                    }
                    revenueOrders = yield this.aggregate('Purchased', [
                        {
                            $match: {
                                mentorId: mentorIdObject,
                                purchasedAt: { $gte: startOfMonth, $lt: endOfMonth },
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalRevenue: { $sum: "$price" },
                                totalOrders: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                totalRevenue: 1,
                                totalOrders: 1,
                                _id: 0
                            }
                        }
                    ]);
                }
                // If only the year is provided, fetch data for the whole year
                else {
                    courseSales = yield this.aggregate('Purchased', [
                        {
                            $match: {
                                mentorId: mentorIdObject,
                                purchasedAt: {
                                    $gte: new Date(`${filterYear}-01-01`),
                                    $lt: new Date(`${filterYear + 1}-01-01`),
                                }
                            }
                        },
                        {
                            $group: {
                                _id: "$courseId",
                                totalSales: { $sum: 1 }
                            }
                        },
                        {
                            $lookup: {
                                from: "courses",
                                localField: "_id",
                                foreignField: "_id",
                                as: "courseDetails"
                            }
                        },
                        { $unwind: "$courseDetails" },
                        {
                            $project: {
                                _id: 0,
                                courseName: "$courseDetails.courseName",
                                totalSales: 1
                            }
                        }
                    ]);
                    let totalPurchases = courseSales.reduce((sum, course) => sum + course.totalSales, 0);
                    courseSales = courseSales.map(course => ({
                        courseName: course.courseName,
                        percentage: totalPurchases > 0 ? ((course.totalSales / totalPurchases) * 100).toFixed(2) : "0.00"
                    }));
                    if (courseSales.length === 0) {
                        courseSales = [{ courseName: "No sales data", percentage: "0.00" }];
                    }
                    revenueOrders = yield this.aggregate('Purchased', [
                        {
                            $match: {
                                mentorId: mentorIdObject,
                                purchasedAt: {
                                    $gte: new Date(`${filterYear}-01-01`),
                                    $lt: new Date(`${filterYear + 1}-01-01`),
                                }
                            }
                        },
                        {
                            $group: {
                                _id: { $month: "$purchasedAt" },
                                totalRevenue: { $sum: "$price" },
                                totalOrders: { $sum: 1 }
                            }
                        },
                        {
                            $sort: { _id: 1 }
                        },
                        {
                            $project: {
                                month: "$_id",
                                totalRevenue: 1,
                                totalOrders: 1,
                                _id: 0
                            }
                        }
                    ]);
                }
                return {
                    year: filterYear,
                    courseSales: courseSales,
                    revenueOrders: revenueOrders
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    mentorSalesReport(mentorId, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('report mentorId', mentorId);
                const mentorIdObject = new mongoose_1.Types.ObjectId(mentorId);
                console.log('obj id ', mentorIdObject);
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
                        $match: Object.assign({ mentorId: mentorIdObject }, dateFilter)
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
                        $project: {
                            _id: 0,
                            username: "$userDetails.username",
                            coursename: "$courseDetails.courseName",
                            price: 1,
                            purchasedAt: 1,
                            transactionId: 1
                        }
                    }
                ]);
                salesCount = report.length;
                console.log('report ', report);
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
exports.default = MentorSalesRepository;
