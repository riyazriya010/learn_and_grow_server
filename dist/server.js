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
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const getId_1 = __importDefault(require("./integration/getId"));
const purchased_model_1 = require("./models/purchased.model");
const chatRooms_model_1 = require("./models/chatRooms.model");
const messages_model_1 = require("./models/messages.model");
const app = (0, express_1.default)();
///////////////////////////////chat
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Role'],
        credentials: true
    }
});
//////////////////////////
(0, database_1.connectDB)();
const origin = 'http://localhost:3000';
const corsOptions = {
    // origin: FRONTEND_URL() || "*",
    // origin: origin || "*",
    origin: [
        "http://localhost:3000",
        "http://localhost:8001",
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// app.use(express.json())
// app.use(express.urlencoded({extended: true}))
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
//////////////////////////////// new api ///////////////////
app.get('/get/mentors/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = (0, getId_1.default)("accessToken", req);
        const getUsers = yield purchased_model_1.PurchasedCourseModel
            .find({ userId: studentId })
            .populate({
            path: "mentorId",
            select: "_id username profilePicUrl"
        });
        const uniqueMentors = new Set();
        const formatted = [];
        for (const data of getUsers) {
            const mentor = data.mentorId;
            if (mentor && !uniqueMentors.has(mentor._id.toString())) {
                uniqueMentors.add(mentor._id.toString());
                // Fetch the chat room for this student and mentor
                const getRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({
                    studentId,
                    mentorId: mentor._id,
                });
                // Add mentor data with lastMessage to the formatted array
                formatted.push({
                    mentorsData: Object.assign(Object.assign({}, mentor.toObject()), { lastMessage: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.lastMessage) || null, userMsgCount: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.userMsgCount) || 0 }),
                });
            }
        }
        return res.status(200).send({
            message: "Mentors Got It",
            success: true,
            result: formatted
        });
    }
    catch (error) {
        console.log('getMentor: ', error);
    }
    // try {
    //   const studentId = getId("accessToken", req);
    //   // Fetch purchased courses and populate mentor data
    //   const getUsers = await PurchasedCourseModel
    //     .find({ userId: studentId })
    //     .populate({
    //       path: "mentorId",
    //       select: "_id username profilePicUrl"
    //     });
    //   // Fetch all chat rooms for this student
    //   const chatRooms = await ChatRoomsModel.find({ studentId }).sort({ updatedAt: -1 });
    //   const uniqueMentors = new Set<string>();
    //   const formatted: any[] = [];
    //   for (const data of getUsers) {
    //     const mentor = data.mentorId as unknown as IMentor;
    //     if (mentor && !uniqueMentors.has(mentor._id.toString())) {
    //       uniqueMentors.add(mentor._id.toString());
    //       // Find the chat room for this mentor
    //       const chatRoom = chatRooms.find(room => room.mentorId.toString() === mentor._id.toString());
    //       // Add mentor data with lastMessage to the formatted array
    //       formatted.push({
    //         mentorsData: {
    //           ...mentor.toObject(),
    //           lastMessage: chatRoom?.lastMessage || null,
    //           userMsgCount: chatRoom?.userMsgCount || 0,
    //         },
    //       });
    //     }
    //   }
    //   return res.status(200).send({
    //     message: "Mentors Retrieved Successfully",
    //     success: true,
    //     result: formatted
    //   });
    // } catch (error: any) {
    //   console.error('getMentor: ', error);
    //   return res.status(500).send({
    //     message: "Error fetching mentors",
    //     success: false,
    //     error: error.message
    //   });
    // }
}));
// creating room
app.post('/create/room', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log();
        const { mentorId } = req.body;
        console.log(mentorId);
        const studentId = (0, getId_1.default)("accessToken", req);
        const existRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ studentId, mentorId });
        if (existRoom) {
            return res.status(200).send({
                message: "Room Already Exist",
                success: true,
                result: existRoom
            });
        }
        const roomData = {
            studentId,
            mentorId
        };
        const newRoom = new chatRooms_model_1.ChatRoomsModel(roomData);
        const createdRoom = yield newRoom.save();
        return res.status(200).send({
            message: "Room Created",
            success: true,
            result: createdRoom
        });
    }
    catch (error) {
        console.log('create room error: ', error);
    }
}));
//save message
app.post('/save/message', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, mentorId } = req.body;
        const studentId = (0, getId_1.default)("accessToken", req);
        const findRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ studentId, mentorId });
        findRoom.lastMessage = message;
        findRoom.mentorMsgCount += 1;
        yield findRoom.save();
        const data = {
            senderId: studentId,
            receiverId: mentorId,
            roomId: findRoom === null || findRoom === void 0 ? void 0 : findRoom._id,
            message: message,
            senderModel: "User",
            receiverModel: "Mentors"
        };
        const newMessage = new messages_model_1.MessageModel(data);
        const savedMessage = yield newMessage.save();
        return res.status(200).send({
            message: "Message Saved",
            success: true,
            result: savedMessage
        });
    }
    catch (error) {
        console.log('save messgae error: ', error);
    }
}));
//get messages
app.get('/get/messages/:mentorId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mentorId } = req.params;
        const studentId = (0, getId_1.default)("accessToken", req);
        const findRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ studentId, mentorId });
        const roomId = findRoom._id;
        const findMessages = yield messages_model_1.MessageModel.find({ roomId });
        return res.send({
            message: "Message Got It",
            success: true,
            result: findMessages
        });
    }
    catch (error) {
        console.log('get message error: ', error);
    }
}));
//delete for everyone
app.patch('/delete/message/everyone/:messageId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messageId } = req.params;
        const findMessage = yield messages_model_1.MessageModel.findById(messageId);
        findMessage.deletedForSender = true;
        findMessage.deletedForReceiver = true;
        yield findMessage.save();
        // Update chat room's last message if necessary
        const chatRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ _id: findMessage.roomId });
        if (chatRoom) {
            const remainingMessages = yield messages_model_1.MessageModel.find({ roomId: chatRoom._id });
            const validMessages = remainingMessages.filter(msg => !msg.deletedForSender && !msg.deletedForReceiver);
            if (validMessages.length > 0) {
                const lastMessage = validMessages[validMessages.length - 1];
                chatRoom.lastMessage = lastMessage.message;
            }
            else {
                chatRoom.lastMessage = '';
            }
            yield chatRoom.save();
        }
        return res.status(200)
            .send({
            message: 'Message Deleted For Everyone',
            success: true,
        });
    }
    catch (error) {
        console.log(error);
    }
}));
// creating room
app.post('/create/mentor/room', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log();
        const { studentId } = req.body;
        console.log(studentId);
        const mentorId = (0, getId_1.default)("accessToken", req);
        const existRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ studentId, mentorId });
        if (existRoom) {
            return res.status(200).send({
                message: "Room Already Exist",
                success: true,
                result: existRoom
            });
        }
        const roomData = {
            studentId,
            mentorId
        };
        const newRoom = new chatRooms_model_1.ChatRoomsModel(roomData);
        const createdRoom = yield newRoom.save();
        return res.status(200).send({
            message: "Room Created",
            success: true,
            result: createdRoom
        });
    }
    catch (error) {
        console.log('create room error: ', error);
    }
}));
//delete for me
app.patch('/delete/message/me/:messageId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { messageId } = req.params;
        const findMessage = yield messages_model_1.MessageModel.findById(messageId);
        findMessage.deletedForSender = true;
        yield findMessage.save();
        // Check if this is the last message sent by the sender, and update chat room's last message
        const chatRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ _id: findMessage.roomId });
        if (chatRoom) {
            const remainingMessages = yield messages_model_1.MessageModel.find({ roomId: chatRoom._id });
            const validMessages = remainingMessages.filter(msg => !msg.deletedForSender);
            if (validMessages.length > 0) {
                const lastMessage = validMessages[validMessages.length - 1];
                chatRoom.lastMessage = lastMessage.message;
            }
            else {
                chatRoom.lastMessage = ''; // No valid messages left
            }
            yield chatRoom.save();
        }
        return res.status(200)
            .send({
            message: 'Message Deleted For Me',
            success: true,
        });
    }
    catch (error) {
        console.log(error);
    }
}));
//reset count
app.patch('/reset/count/:mentorId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mentorId } = req.params;
        const studentId = yield (0, getId_1.default)('accessToken', req);
        const findRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ studentId, mentorId });
        findRoom.userMsgCount = 0;
        yield findRoom.save();
        //find messages
        const findMessages = yield messages_model_1.MessageModel.find({ roomId: findRoom.id });
        return res
            .status(200)
            .send({
            message: "User Count Reseted",
            success: true,
            result: findMessages
        });
    }
    catch (error) {
    }
}));
//////////////////////////// mentors ///////////////////////////////
app.get('/get/students', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mentorId = (0, getId_1.default)("accessToken", req);
        const getUsers = yield chatRooms_model_1.ChatRoomsModel
            .find({ mentorId })
            .populate({
            path: "studentId",
            select: "_id username profilePicUrl"
        });
        const uniqueStudents = new Set();
        const formatted = [];
        for (const data of getUsers) {
            const student = data.studentId;
            if (student && !uniqueStudents.has(student._id.toString())) {
                uniqueStudents.add(student._id.toString());
                // Fetch the chat room for this student and mentor
                const getRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({
                    mentorId,
                    studentId: student._id,
                });
                // Add mentor data with lastMessage to the formatted array
                formatted.push({
                    studentData: Object.assign(Object.assign({}, student.toObject()), { lastMessage: (getRoom === null || getRoom === void 0 ? void 0 : getRoom.lastMessage) || null }),
                });
            }
        }
        return res.status(200).send({
            message: "Students Got It",
            success: true,
            result: formatted
        });
    }
    catch (error) {
        console.log(error);
    }
}));
//get messages
app.get('/get/mentor/messages/:studentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const mentorId = (0, getId_1.default)("accessToken", req);
        const findRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ studentId, mentorId });
        const roomId = findRoom._id;
        const findMessages = yield messages_model_1.MessageModel.find({ roomId });
        return res.send({
            message: "Message Got It",
            success: true,
            result: findMessages
        });
    }
    catch (error) {
        console.log('get message error: ', error);
    }
}));
//save message
app.post('/save/mentor/message', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, studentId } = req.body;
        const mentorId = (0, getId_1.default)("accessToken", req);
        const findRoom = yield chatRooms_model_1.ChatRoomsModel.findOne({ studentId, mentorId });
        findRoom.lastMessage = message;
        findRoom.userMsgCount += 1;
        yield findRoom.save();
        const data = {
            senderId: mentorId,
            receiverId: studentId,
            roomId: findRoom === null || findRoom === void 0 ? void 0 : findRoom._id,
            message: message,
            senderModel: "Mentors",
            receiverModel: "User"
        };
        const newMessage = new messages_model_1.MessageModel(data);
        const savedMessage = yield newMessage.save();
        return res.status(200).send({
            message: "Message Saved",
            success: true,
            result: savedMessage
        });
    }
    catch (error) {
        console.log('save messgae error: ', error);
    }
}));
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
        // io.emit("notification",  'Notify from Server' );
        io.emit("notify", 'Notify from Server');
    });
    socket.on('studentTyping', (data) => {
        io.to(data.roomId).emit('studentTyping', { userId: data.userId });
    });
    socket.on('studentStopTyping', (data) => {
        io.to(data.roomId).emit('studentStopTyping', { userId: data.userId });
    });
    socket.on('mentorTyping', (data) => {
        io.to(data.roomId).emit('mentorTyping', { userId: data.userId });
    });
    socket.on('mentorStopTyping', (data) => {
        io.to(data.roomId).emit('mentorStopTyping', { userId: data.userId });
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
/////////////////////////////////////////////////////
// io.on('connection', (socket) => {
//   console.log('A user connected : ', socket.id);
//   // Join Room
//   socket.on('joinRoom', (roomId) => {
//     console.log('User joined room:', roomId);
//     socket.join(roomId);
//   });
//   // Listen for "sendMessage" and notify the recipient
//   socket.on('sendMessage', (messageData) => {
//     console.log('sendMessage: ', messageData);
//     const { message, roomId, senderId, receiverId } = messageData;
//     // Emit the message to all users in the room (including sender)
//     io.to(roomId).emit('receiveMessage', {
//       senderId,
//       receiverId,
//       message,
//       createdAt: new Date().toISOString()
//     });
//     // Notify only the recipient (exclude sender)
//     socket.to(roomId).emit('notification', {
//       senderId,
//       receiverId,
//       message,
//       createdAt: new Date().toISOString(),
//     });
//   });
//   // Custom event for testing (optional)
//   socket.on('custom-event', (message) => {
//     console.log(message);
//     socket.broadcast.emit('receiveMessage', message);
//   });
// });
///////////////////////////////////////
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
