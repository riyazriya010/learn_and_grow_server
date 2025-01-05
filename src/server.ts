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
import { CertificateModel } from './models/certificate.model'

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

  
  // Global error handler (optional)
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', success: false });
  });


  // certificate
  app.get('/', async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = '676a9f2a339270ae95450b75'; // Replace with actual user ID from your database
        const courseId = '67710140df708808ce0fd712'; // Replace with actual course ID from your database
        const courseName = 'JavaScript'; // Replace with course name
        const userName = 'Riyas'; // Replace with user name
        const issuedDate = new Date(); // Current date

        // Create a new certificate
        const certificate = new CertificateModel({
            userId,
            courseId,
            courseName,
            userName,
            issuedDate,
        });

        // Save the certificate to the database
        const savedCertificate = await certificate.save();

        return res.status(201).json({
            message: 'Certificate created successfully!',
            data: savedCertificate,
        });
    } catch (error: any) {
        console.error('Error creating certificate:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.use("/api/user-service", userRoutes)
app.use("/api/mentor-service", mentorRoutes)
app.use("/api/admin-service", adminRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})