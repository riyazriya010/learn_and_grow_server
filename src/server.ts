import dotenv from 'dotenv';
dotenv.config();

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
import logger from './utils/logger'

import http from 'http';
import { Server } from 'socket.io';

const app = express()


/////////////////////////////// chat ////////////////////////
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

// const origin = 'http://localhost:3000'
// const corsOptions = {
//   // origin: FRONTEND_URL() || "*",
//   // origin: origin || "*",
//   origin: [
//     "http://localhost:3000",
//     "http://localhost:8001",
//   ],
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   credentials: true
// }


// Load frontend URLs from env or fallback
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  "http://localhost:3000",
  "http://localhost:8001",
  "https://learn-and-grow-client.vercel.app",
];

// Configure CORS
const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(logger); // for logging morgan in the separate file
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });


////// Pre Signed URL //////////

// const s3 = new S3Client({
//   region: process.env.AWS_REGION || "us-east-1",
//   credentials: {
//     accessKeyId: process.env.ACCESS_KEY || "",
//     secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
//   },
// });


// app.post('/student/generate-presigned-url', async (req: Request, res: Response): Promise<any> => {
//   try {
//     console.log('req body file: ', req.body)
//     // const { fileName, fileType } = req.body; // Get file name & type from frontend

//     // if (!fileName || !fileType) {
//     //   return res.status(400).json({ message: "Missing fileName or fileType" });
//     // }

//     // const fileKey = `${Date.now()}-${fileName}`; // Unique file name in S3
//     // const bucketName = process.env.BUCKET_NAME || "";

//     // const command = new PutObjectCommand({
//     //   Bucket: bucketName,
//     //   Key: fileKey,
//     //   ContentType: fileType,
//     // });

//     // const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5 minutes expiry

//     // res.json({
//     //   presignedUrl,
//     //   fileKey,
//     // });


//     const { files } = req.body;
//     if (!Array.isArray(files) || files.length === 0) {
//       return res.status(400).json({ message: "No files provided" });
//     }

//     const urls = await Promise.all(
//       files.map(async (file) => {
//         const fileKey = `courses/${Date.now()}-${file.fileName}`;

//         const command = new PutObjectCommand({
//           Bucket: process.env.BUCKET_NAME,
//           Key: fileKey,
//           ContentType: file.fileType,
//         });

//         const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

//         return { fileKey, presignedUrl };
//       })
//     );

//     res.status(200).json({ urls });

//   } catch (error: any) {
//     console.info('AWS ERROR::: ', error)
//   }
// })



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


