import express from 'express'
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


app.use("/api/user-service", userRoutes)
app.use("/api/mentor-service", mentorRoutes)
app.use("/api/admin-service", adminRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})