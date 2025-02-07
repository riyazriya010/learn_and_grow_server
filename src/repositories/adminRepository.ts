import { AdminWalletModel, IAdminWallet } from "../models/adminWallet.model";
import { CategoryModel, ICategory } from "../models/categroy.model";
import { ChapterModel } from "../models/chapter.model";
import MentorModel, { IMentor } from "../models/mentor.model";
import { PurchasedCourseModel } from "../models/purchased.model";
import { CourseModel, ICourse } from "../models/uploadCourse.model";
import UserModel, { IUser } from "../models/user.model"
import { AdminBaseRepository } from "./baseRepo/adminBase.repository"
import { subDays, subMonths, subYears, startOfDay, endOfDay } from 'date-fns';

export class AdminRepository {
    private mentorBaseRepository: AdminBaseRepository<IMentor>;
    private userBaseRepository: AdminBaseRepository<IUser>;
    private categoryBaseRepository: AdminBaseRepository<ICategory>;
    private courseBaseRepository: AdminBaseRepository<ICourse>;
    private walletBaseRepository: AdminBaseRepository<IAdminWallet>;

    constructor() {
        this.userBaseRepository = new AdminBaseRepository<IUser>(UserModel)
        this.mentorBaseRepository = new AdminBaseRepository<IMentor>(MentorModel)
        this.categoryBaseRepository = new AdminBaseRepository<ICategory>(CategoryModel)
        this.courseBaseRepository = new AdminBaseRepository<ICourse>(CourseModel)
        this.walletBaseRepository = new AdminBaseRepository<IAdminWallet>(AdminWalletModel)
    }

    async getUsers(page: number, limit: number): Promise<any> {
        try {
            const response = await this.userBaseRepository.getUsers(page, limit)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    async getMentors(page: number, limit: number): Promise<any> {
        try {
            const response = await this.mentorBaseRepository.getMentors(page, limit)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    async blockMentor(id: string): Promise<any> {
        try {
            const response = await this.mentorBaseRepository.blockMentor(id);
            return response;
        } catch (error) {
            console.error('Error in AdminRepository while blocking mentor:', error);
            throw new Error('Failed to block mentor in AdminRepository');
        }
    }

    async unBlockMentor(id: string): Promise<any> {
        try {
            const response = await this.mentorBaseRepository.unBlockMentor(id);
            return response;
        } catch (error) {
            console.error('Error in AdminRepository while Unblocking mentor:', error);
            throw new Error('Failed to Unblock mentor in AdminRepository');
        }
    }


    async blockUser(id: string): Promise<any> {
        try {
            const response = await this.userBaseRepository.blockUser(id);
            return response;
        } catch (error) {
            console.error('Error in AdminRepository while blocking User:', error);
            throw new Error('Failed to block User in AdminRepository');
        }
    }


    async unBlockUser(id: string): Promise<any> {
        try {
            const response = await this.userBaseRepository.unBlockUser(id);
            return response;
        } catch (error) {
            console.error('Error in AdminRepository while Unblocking User:', error);
            throw new Error('Failed to Unblock User in AdminRepository');
        }
    }

    async addCategory(data: string): Promise<any> {
        try {
            const response = await this.categoryBaseRepository.addCategory(data)
            return response
        } catch (error: any) {
            throw error
        }
    }

    async editCategory(categoryName: string, categoryId: string): Promise<any> {
        try {
            const response = await this.categoryBaseRepository.editCategory(categoryName, categoryId)
            return response
        } catch (error: any) {
            throw error
        }
    }


    async unListCategory(categoryId: string): Promise<any> {
        try {
            const response = await this.categoryBaseRepository.unListCategory(categoryId)
            return response
        } catch (error: any) {
            throw error
        }
    }


    async listCategory(categoryId: string): Promise<any> {
        try {
            const response = await this.categoryBaseRepository.listCategory(categoryId)
            return response
        } catch (error: any) {
            throw error
        }
    }


    async getAllCategory(page: number, limit: number): Promise<any> {
        try {
            const response = await this.categoryBaseRepository.getAllCategory(page, limit)
            return response
        } catch (error) {
            console.log(error)
        }
    }


    async getAllCourse(page: number, limit: number): Promise<any> {
        try {
            const response = await this.courseBaseRepository.getAllCourse(page, limit)
            return response
        } catch (error) {
            console.log(error)
        }
    }


    async unListCourse(courseId: string): Promise<any> {
        try {
            const response = await this.courseBaseRepository.unListCourse(courseId)
            return response
        } catch (error: any) {
            throw error
        }
    }


    async listCourse(courseId: string): Promise<any> {
        try {
            const response = await this.courseBaseRepository.listCourse(courseId)
            return response
        } catch (error: any) {
            throw error
        }
    }


    async getWallet(userId: string, pageNumber: number, limitNumber: number): Promise<any> {
        try {
            const response = await this.walletBaseRepository.getWallet(userId, pageNumber, limitNumber)
            return response
        } catch (error: any) {
            throw error
        }
    }



    /////////////////////////////////// WEEK - 4 /////////////////////////////////

    async adminNonApprovedCourse(pageNumber: number, limitNumber: number): Promise<any> {
        try {

            const skip = (pageNumber - 1) * limitNumber;

            const getCourses = await CourseModel
                .find({ approved: false })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNumber)
                .exec();

            const totalCourses = await CourseModel.countDocuments();

            return {
                courses: getCourses,
                currentPage: pageNumber,
                totalPages: Math.ceil(totalCourses / limitNumber),
                totalCourses: totalCourses,
            }
        } catch (error: any) {
            throw error
        }
    }

    async adminNonApprovedCourseDetails(courseId: string): Promise<any> {
        try {
            const checkApprove = await CourseModel.findById(courseId) as ICourse
            if(checkApprove.approved){
                return []
            }
            const getChapters = await ChapterModel.find({ courseId }).exec()
            return getChapters
        } catch (error: any) {
            throw error
        }
    }

    async adminDashboard(): Promise<any> {
        try {
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
            const revenueStats = await PurchasedCourseModel.aggregate([
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
            const getUsers = await UserModel.find({ isBlocked: false }).countDocuments().exec()
            const getMentors = await MentorModel.find({ isBlocked: false }).countDocuments().exec()


            // 📌 2️⃣ Course Performance Stats
            const courses = await CourseModel.find();
            const totalCourses = courses.length;


            //enrollment data calculations
            const categoryWiseEnrollments = await PurchasedCourseModel.aggregate([
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

            const mostEnrolledCourse = await PurchasedCourseModel.aggregate([
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

            const leastEnrolledCourse = await PurchasedCourseModel.aggregate([
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
                    course: mostEnrolledCourse[0]?.courseName || "No Course",
                },
                leastEnrolledCategory: {
                    categoryName: leastEnrolledCategory.categoryName,
                    enrollments: leastEnrolledCategory.totalEnrollments,
                    course: leastEnrolledCourse[0]?.courseName || "No Course",
                },
            };


            const totalStudents = await PurchasedCourseModel.countDocuments()

            const activeStudents = await PurchasedCourseModel.countDocuments({
                "completedChapters.completedAt": { $gte: subMonths(new Date(), 1) }
            });

            const totalCompletedCourses = await PurchasedCourseModel.countDocuments({
                isCourseCompleted: true
            });

            const courseCompletionRate = totalStudents > 0 ? Math.floor((totalCompletedCourses / totalStudents) * 100) : 0;

            // 📌 4️⃣ Sales & Revenue Trends (Last 6 Months)
            const salesTrends = await PurchasedCourseModel.aggregate([
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
            const topCourses = await PurchasedCourseModel.aggregate([
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
        } catch (error: any) {
            throw error
        }
    }

    async adminChartGraph(filters: any): Promise<any> {
        try {
            const { year, month, date } = filters;
            const currentYear = new Date().getFullYear();
            const filterYear = year ? parseInt(year as string) : currentYear;

            let courseSales = [];
            let revenue: { month: any; totalRevenue: any; totalOrders: any }[] = [];

            let matchFilter = {};
            let selectedMonth = null;

            if (date) {
                const specificDate = new Date(date as string);
                selectedMonth = specificDate.getMonth() + 1;
                const startOfDay = new Date(specificDate.setHours(0, 0, 0, 0));
                const endOfDay = new Date(specificDate.setHours(23, 59, 59, 999));
                matchFilter = { purchasedAt: { $gte: startOfDay, $lt: endOfDay } };
            } else if (month) {
                selectedMonth = new Date(`${month} 1, 2022`).getMonth() + 1;
                const startOfMonth = new Date(`${filterYear}-${String(selectedMonth).padStart(2, '0')}-01`);
                const endOfMonth = new Date(startOfMonth);
                endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                matchFilter = { purchasedAt: { $gte: startOfMonth, $lt: endOfMonth } };
            } else {
                matchFilter = {
                    purchasedAt: {
                        $gte: new Date(`${filterYear}-01-01`),
                        $lt: new Date(`${filterYear + 1}-01-01`),
                    },
                };
            }

            // Aggregate course sales by category
            courseSales = await PurchasedCourseModel.aggregate([
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
            const revenueOrders = await PurchasedCourseModel.aggregate([
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
            }
        } catch (error: any) {
            throw error
        }
    }

    async adminSalesReport(filters: any): Promise<any> {
        try {
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

            report = await PurchasedCourseModel.aggregate([
                {
                    $match: {
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
            }
        } catch (error: any) {
            throw error
        }
    }

    async adminApproveCourse(courseId: string): Promise<any> {
        try {
            const approveCourse = await CourseModel.findByIdAndUpdate(
                courseId,
                { approved: true },
                { new: true }
            );
            return approveCourse
        } catch (error: any) {
            throw error
        }
    }

}

