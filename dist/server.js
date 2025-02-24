"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
// import logger from './utils/logger'
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
/////////////////////////////// chat ////////////////////////
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        // origin: "http://localhost:3000",
        origin: "https://www.learngrow.live",
        methods: ["GET", "POST", 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Role'],
        credentials: true
    }
});
//////////////////////////
(0, database_1.connectDB)();
const allowedOrigins = [
    // "http://localhost:3000",
    // "http://localhost:8001",
    "https://www.learngrow.live",
    "https://api.learngrow.live",
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)('dev'));
// app.use(logger);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'https://www.learngrow.live');
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
