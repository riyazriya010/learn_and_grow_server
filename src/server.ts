import express, { NextFunction, Request, Response } from 'express'
// import session from 'express-session'
import { FRONTEND_URL, PORT } from './utils/constants'
import morgan from 'morgan'
import { connectDB } from './config/database'
import cors from 'cors'
import userRoutes from './routes/students.routes'
import cookieParser from 'cookie-parser'
import mentorRoutes from './routes/mentors.routes'
import adminRoutes from './routes/admin.routes'
import bodyParser from 'body-parser'
import { CourseModel } from './models/uploadCourse.model'
import { ChapterModel } from './models/chapter.model'
import { PurchasedCourseModel } from './models/purchased.model'
import { string } from 'joi'
// import userRouter from './routes/user.routes'

const app = express()

connectDB()

const origin =  'http://localhost:3000'
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


// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//   }))
  
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







app.get('/', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        console.log('entered')
      const courseId = '67710140df708808ce0fd712';
      const userId = '676a9f2a339270ae95450b75';
  
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found', success: false });
      }

      console.log('course got it')
      const chapters = await ChapterModel.find({ courseId });
      if (chapters.length === 0) {
        return res.status(404).json({ message: 'No chapters found for this course', success: false });
      }
  
      console.log('chapter for course got it')
      const completedChapters = chapters.map((chapter) => ({
        chapterId: chapter._id,
        isCompleted: false,
      }));
  
      const purchasedCourse = new PurchasedCourseModel({
        userId,
        courseId,
        completedChapters,
        isCourseCompleted: false,
      });

      console.log('purchase model created')
      await purchasedCourse.save();
      console.log('purchase saved')
      return res.send('Purchase done');
    } catch (error) {
      next(error); // Passes the error to the global error handler
    }
  });
  
  // Global error handler (optional)
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', success: false });
  });


  // Get course details endpoint
app.get('/course-details/:userId/:courseId', async (req: Request, res: Response): Promise<any> => {
    const { userId, courseId } = req.params;
  
    try {
      // Fetching purchased course data
      const purchasedCourse = await PurchasedCourseModel.findOne({ userId, courseId });
      if (!purchasedCourse) {
        return res.status(404).json({ message: 'Purchased course not found', success: false });
      }
  
      // Fetching the course details from CourseModel
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found', success: false });
      }
  
      // Fetching the chapters for the course
      const chapters = await ChapterModel.find({ courseId });
      if (!chapters.length) {
        return res.status(404).json({ message: 'No chapters found for this course', success: false });
      }
  
      // Map chapters to include completion status
      const updatedChapters = chapters.map((chapter) => {
        const completedChapter = purchasedCourse.completedChapters.find((completed) => completed.chapterId === chapter._id);
        return {
          ...chapter.toObject(),
          isCompleted: completedChapter?.isCompleted || false,  // Default to false if not completed
        };
      });
  
      // Combine and send the response
      const responseData = {
        course,
        chapters: updatedChapters,
        purchasedCourse,
      };
  
      return res.status(200).json(responseData);
  
    } catch (error) {
      console.error('Error fetching course data:', error);
      return res.status(500).json({ message: 'An error occurred while fetching course data', success: false });
    }
  });

  app.patch('/api/complete-chapter/:chapterId', async (req: Request, res: Response): Promise<any> => {
    const { chapterId } = req.params;
    const { isCompleted } = req.body;  // Expecting { isCompleted: boolean }

    try {
        // Find the chapter in the purchased course
        const purchasedCourse = await PurchasedCourseModel.findOne({
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
        await purchasedCourse.save();

        // Respond with success
        return res.status(200).json({ message: 'Chapter completion updated', success: true });
    } catch (error) {
        console.error('Error updating chapter completion:', error);
        return res.status(500).json({ message: 'Internal Server Error', success: false });
    }
});
  
  


app.use("/api/user-service", userRoutes)
app.use("/api/mentor-service", mentorRoutes)
app.use("/api/admin-service", adminRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})