import { IMentorSalesMethods } from "../../../interface/mentors/mentor.interface";
import mongoose, { Types } from "mongoose";
import { subDays, subMonths, subYears, startOfDay, endOfDay } from 'date-fns';
import { IPurchasedCourse, PurchasedCourseModel } from "../../../models/purchased.model";
import { CourseModel, ICourse } from "../../../models/uploadCourse.model";
import CommonBaseRepository from "../../baseRepositories/commonBaseRepository";

export default class MentorSalesRepository extends CommonBaseRepository<{
    Purchased: IPurchasedCourse;
    Course: ICourse
}> implements IMentorSalesMethods {

    constructor() {
        super({
            Purchased: PurchasedCourseModel,
            Course: CourseModel
        })
    }
    

    async mentorDashboard(mentorId: string): Promise<any> {
        try {
            const mentorObjectId = new Types.ObjectId(mentorId);

            const todayStart = startOfDay(new Date());
            const todayEnd = endOfDay(new Date());

            // Get yesterday's date
            const yesterday = subDays(new Date(), 1);

            // Last 30 days till yesterday
            const prevMonthStart = startOfDay(subDays(yesterday, 29));
            const prevMonthEnd = endOfDay(yesterday);

            // Last 365 days till yesterday
            const prevYearStart = startOfDay(subDays(yesterday, 364));
            const prevYearEnd = endOfDay(yesterday);

            // Last 6 months
            const sixMonthsStart = startOfDay(subMonths(new Date(), 5));

            // 📌 1️⃣ Revenue Stats
            const revenueStats = await this.aggregate('Purchased', [
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
            const courses = await this.findAll('Course', { mentorId: mentorObjectId });
            const totalCourses = courses.length;

            const mostEnrolledCourse = await this.aggregate('Purchased', [
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

            const leastEnrolledCourse = await this.aggregate('Purchased', [
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
            const totalStudents = await this.findAll('Purchased', { mentorId: mentorObjectId }).countDocuments();

            const activeStudents = await this.findAll('Purchased', {
                mentorId: mentorObjectId,
                "completedChapters.completedAt": { $gte: subMonths(new Date(), 1) }
            }).countDocuments();

            const totalCompletedCourses = await this.findAll('Purchased', {
                mentorId: mentorObjectId,
                isCourseCompleted: true
            }).countDocuments();

            const courseCompletionRate = totalStudents > 0 ? Math.floor((totalCompletedCourses / totalStudents) * 100) : 0;

            // 📌 4️⃣ Sales & Revenue Trends (Last 6 Months)
            const salesTrends = await this.aggregate('Purchased', [
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
            const topCourses = await this.aggregate('Purchased', [
                { $match: { mentorId: mentorObjectId } },
                { $group: { _id: "$courseId", revenue: { $sum: "$price" }, enrollments: { $sum: 1 } } },
                { $sort: { revenue: -1 } },
                { $limit: 5 }
            ]);

            return {
                // Revenue Overview
                todayRevenue: revenueStats[0]?.todayRevenue || 0,
                prevMonthRevenue: revenueStats[0]?.prevMonthRevenue || 0,
                prevYearRevenue: revenueStats[0]?.prevYearRevenue || 0,
                totalRevenue: revenueStats[0]?.totalRevenue || 0,

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
            }
        } catch (error: unknown) {
            throw error
        }
    }


    async mentorChartGraph(mentorId: string, filters: any): Promise<any> {
        try {
            console.log('chart mentorId: ', mentorId)
            const mentorIdObject = new Types.ObjectId(mentorId);
            const { year, month, date } = filters;

            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;

            const filterYear = year ? parseInt(year as string) : currentYear;

            // Default empty arrays for courseSales and revenueOrders
            let courseSales = [];
            let revenueOrders = [];

            // If the date is provided, filter for the specific date
            if (date) {
                const specificDate = new Date(date as string);
                const startOfDay = new Date(specificDate.setHours(0, 0, 0, 0));
                const endOfDay = new Date(specificDate.setHours(23, 59, 59, 999));

                courseSales = await this.aggregate('Purchased', [
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

                revenueOrders = await this.aggregate('Purchased', [
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

                courseSales = await this.aggregate('Purchased', [
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

                revenueOrders = await this.aggregate('Purchased', [
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
                courseSales = await this.aggregate('Purchased', [
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

                revenueOrders = await this.aggregate('Purchased', [
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
            }
        } catch (error: unknown) {
            throw error
        }
    }


    async mentorSalesReport(mentorId: string, filters: any): Promise<any> {
        try {
            console.log('report mentorId', mentorId)
            const mentorIdObject = new Types.ObjectId(mentorId);
            console.log('obj id ', mentorIdObject)
            const { year, month, date } = filters;

            const currentYear = new Date().getFullYear();
            const filterYear = year ? parseInt(year as string) : currentYear;

            let report = [];
            let salesCount = 0;
            let dateFilter = {};

            if (date) {
                const startOfDay = new Date(date.startDate);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(date.endDate);
                endOfDay.setHours(23, 59, 59, 999);

                dateFilter = { purchasedAt: { $gte: startOfDay, $lt: endOfDay } };
            } else if (month) {
                const monthIndex = new Date(`${month} 1, 2022`).getMonth() + 1;
                const startOfMonth = new Date(`${filterYear}-${String(monthIndex).padStart(2, '0')}-01`);
                const endOfMonth = new Date(startOfMonth);
                endOfMonth.setMonth(endOfMonth.getMonth() + 1);

                dateFilter = { purchasedAt: { $gte: startOfMonth, $lt: endOfMonth } };
            } else {
                dateFilter = { purchasedAt: { $gte: new Date(`${filterYear}-01-01`), $lt: new Date(`${filterYear + 1}-01-01`) } };
            }

            report = await this.aggregate('Purchased', [
                {
                    $match: {
                        mentorId: mentorIdObject,
                        ...dateFilter
                    }
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
            console.log('report ', report)
            return {
                report: report,
                salesCount: salesCount
            }
        } catch (error: unknown) {
            throw error
        }
    }

}