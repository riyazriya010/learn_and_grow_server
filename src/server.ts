import express, { NextFunction, Request, Response } from 'express'
import { FRONTEND_URL, PORT } from './utils/constants'
import morgan from 'morgan'
import { connectDB } from './config/database'
import cors from 'cors'
import userRoutes from './routes/students.routes'
import cookieParser from 'cookie-parser'
import mentorRoutes from './routes/mentors.routes'
import adminRoutes from './routes/admin.routes'
import bodyParser from 'body-parser'
// import "./integration/userReminderTask"

import http from 'http';
import { Server } from 'socket.io';
import { PurchasedCourseModel } from './models/purchased.model'

import { subDays, subMonths, subYears, startOfDay, endOfDay } from 'date-fns';
import { Types } from 'mongoose'
import { CourseModel } from './models/uploadCourse.model'
import { ChapterModel } from './models/chapter.model'
import UserModel from './models/user.model'
import MentorModel from './models/mentor.model'
// import { startOfDay, endOfDay, subDays, subMonths, subYears } from 'date-fns';

const app = express()

///////////////////////////////chat
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Role'],
    credentials: true
  }
});
//////////////////////////

connectDB()

const origin = 'http://localhost:3000'
const corsOptions = {
  // origin: FRONTEND_URL() || "*",
  // origin: origin || "*",
  origin: [
    "http://localhost:3000",
    "http://localhost:8001",
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true
}

app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json())
// app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});



// admin side
//dashboard
app.get('/get/admin/dashboard', async (req: Request, res: Response): Promise<any> => {
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
    const getUsers = await UserModel.find({isBlocked: false}).countDocuments().exec()
    const getMentors = await MentorModel.find({isBlocked: false}).countDocuments().exec()


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

    return res.status(200).send({
      message: "Dashboard Data Retrieved",
      success: true,
      result: {
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
    });
  } catch (error: any) {
    console.error('Error on server dashboard', error);
    return res.status(500).send({
      message: "Server Error",
      success: false,
      error: error.message
    });
  }
});


app.get('/get/admin/chart/graph/data', async (req: Request, res: Response): Promise<any> => {
  try {
    console.log('Filters:', req.query);

    const filters = req.query.filter ? JSON.parse(req.query.filter as string) : {};
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

    return res.status(200).send({
      message: 'Course sales data fetched successfully',
      success: true,
      result: {
        year: filterYear,
        courseSales: courseSales,
        revenue: revenue, // Revenue is now grouped by month
      },
    });
  } catch (error: any) {
    console.error('Error fetching chart/graph data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//sales report
app.get('/get/admin/report', async (req: Request, res: Response): Promise<any> => {
  try {
    const filters = req.query.filter ? JSON.parse(req.query.filter as string) : {};
    console.log('filters ', filters);

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

    return res.status(200).send({
      message: 'Mentor Report Retrieved',
      success: true,
      result: {
        report: report,
        salesCount: salesCount
      }
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).send({ message: "Internal Server Error", success: false });
  }
});




app.get('/get/non-approved/courses', async (req: Request, res: Response): Promise<any> => {
  try {
    console.log('req ', req.query)
    const { page = 1, limit = 1 } = req.query

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    const skip = (pageNumber - 1) * limitNumber;

    const getCourses = await CourseModel
      .find({ approved: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .exec();

    const totalCourses = await CourseModel.countDocuments();

    return res.status(200).send({
      message: 'Not Approved Course Got It',
      success: true,
      result: {
        courses: getCourses,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCourses / limitNumber),
        totalCourses: totalCourses,
      }
    })
  } catch (error: any) {
    console.log(error)
  }
})


app.get('/get/non-approved/course-details', async (req: Request, res: Response): Promise<any> => {
  try {
    const { courseId } = req.query
    const getChapters = await ChapterModel.find({ courseId }).exec()
    console.log('getchap ', getChapters)
    return res.status(200).send({
      message: 'Chapter Got It',
      success: true,
      result: getChapters
    })
  } catch (error: any) {
    console.log(error)
  }
})

/////


// socket //

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('sendMessage', (data) => {
    console.log('data ', data)
    const { receiverId, roomId, message } = data;

    // Emit to all users in the room except the sender
    io.to(roomId).emit('receiveMessage', message);

    // to update the chatlist of student and mentor
    socket.broadcast.emit('notify')
    socket.broadcast.emit('notifyMentor')

    // io.emit("notification",  'Notify from Server' );
    // this is for navbar
    socket.broadcast.emit("chatNotify", receiverId);

    socket.broadcast.emit("mentorChatNotify", receiverId);

  });

  //deleteMessage
  socket.on("deleteNotify", () => {
    socket.broadcast.emit("deletedMessage")
  })

  //online indicating
  socket.on('onlineUser', userId => {
    socket.broadcast.emit('updateOnline', userId)
  })

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
    io.emit('courseNotify', courseName)
  })


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


// Global error handler (optional)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', success: false });
});



app.use("/api/user-service", userRoutes)
app.use("/api/mentor-service", mentorRoutes)
app.use("/api/admin-service", adminRoutes)

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
})