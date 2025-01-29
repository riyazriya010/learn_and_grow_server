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
import getId from './integration/getId'
import { PurchasedCourseModel } from './models/purchased.model'
import { ChatRoomsModel, IChatRooms } from './models/chatRooms.model'
import { IMessages, MessageModel } from './models/messages.model'
import { IMentor } from './models/mentor.model'
import { IUser } from './models/user.model'

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


//////////////////////////////// new api ///////////////////

app.get('/get/mentors/', async (req: Request, res: Response): Promise<any> => {
  try {
    const studentId = getId("accessToken", req)
    const getUsers = await PurchasedCourseModel
      .find({ userId: studentId })
      .populate({
        path: "mentorId",
        select: "_id username profilePicUrl"
      });
    const uniqueMentors = new Set<string>();
    const formatted: any[] = [];

    for (const data of getUsers) {
      const mentor = data.mentorId as unknown as IMentor
      if (mentor && !uniqueMentors.has(mentor._id.toString())) {
        uniqueMentors.add(mentor._id.toString());

        // Fetch the chat room for this student and mentor
        const getRoom = await ChatRoomsModel.findOne({
          studentId,
          mentorId: mentor._id,
        });

        // Add mentor data with lastMessage to the formatted array
        formatted.push({
          mentorsData: {
            ...mentor.toObject(),
            lastMessage: getRoom?.lastMessage || null,
            userMsgCount: getRoom?.userMsgCount || 0,
          },
        });
      }
    }
    return res.status(200).send
      ({
        message: "Mentors Got It",
        success: true,
        result: formatted
      })
  } catch (error: any) {
    console.log('getMentor: ', error)
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

})

// creating room
app.post('/create/room', async (req: Request, res: Response): Promise<any> => {
  try {
    console.log()
    const { mentorId } = req.body
    console.log(mentorId)
    const studentId = getId("accessToken", req)
    const existRoom = await ChatRoomsModel.findOne({ studentId, mentorId }) as unknown as IChatRooms
    if (existRoom) {
      return res.status(200).send
        ({
          message: "Room Already Exist",
          success: true,
          result: existRoom
        })
    }
    const roomData = {
      studentId,
      mentorId
    }
    const newRoom = new ChatRoomsModel(roomData)
    const createdRoom = await newRoom.save()
    return res.status(200).send
      ({
        message: "Room Created",
        success: true,
        result: createdRoom
      })
  } catch (error: any) {
    console.log('create room error: ', error)
  }
})

//save message
app.post('/save/message', async (req: Request, res: Response): Promise<any> => {
  try {
    const { message, mentorId } = req.body
    const studentId = getId("accessToken", req)
    const findRoom = await ChatRoomsModel.findOne({ studentId, mentorId }) as IChatRooms
    findRoom.lastMessage = message
    findRoom.mentorMsgCount += 1
    await findRoom.save()

    const data: any = {
      senderId: studentId,
      receiverId: mentorId,
      roomId: findRoom?._id,
      message: message,
      senderModel: "User",
      receiverModel: "Mentors"
    }
    const newMessage = new MessageModel(data)
    const savedMessage = await newMessage.save()
    return res.status(200).send
      ({
        message: "Message Saved",
        success: true,
        result: savedMessage
      })
  } catch (error: any) {
    console.log('save messgae error: ', error)
  }
})

//get messages
app.get('/get/messages/:mentorId', async (req: Request, res: Response): Promise<any> => {
  try {
    const { mentorId } = req.params
    const studentId = getId("accessToken", req)
    const findRoom = await ChatRoomsModel.findOne({ studentId, mentorId }) as unknown as IChatRooms
    const roomId = findRoom._id
    const findMessages = await MessageModel.find({ roomId })
    return res.send({
      message: "Message Got It",
      success: true,
      result: findMessages
    })
  } catch (error: any) {
    console.log('get message error: ', error)
  }
})

//delete for everyone
app.patch('/delete/message/everyone/:messageId', async (req: Request, res: Response): Promise<any> => {
  try {
    const { messageId } = req.params
    const findMessage = await MessageModel.findById(messageId) as unknown as IMessages
    findMessage.deletedForSender = true
    findMessage.deletedForReceiver = true
    await findMessage.save()
    // Update chat room's last message if necessary
    const chatRoom = await ChatRoomsModel.findOne({ _id: findMessage.roomId });

    if (chatRoom) {
      const remainingMessages = await MessageModel.find({ roomId: chatRoom._id });
      const validMessages = remainingMessages.filter(msg => !msg.deletedForSender && !msg.deletedForReceiver);

      if (validMessages.length > 0) {
        const lastMessage = validMessages[validMessages.length - 1];
        chatRoom.lastMessage = lastMessage.message;
      } else {
        chatRoom.lastMessage = '';
      }

      await chatRoom.save();
    }

    return res.status(200)
      .send({
        message: 'Message Deleted For Everyone',
        success: true,
      })
  } catch (error: any) {
    console.log(error)
  }
})

// creating room
app.post('/create/mentor/room', async (req: Request, res: Response): Promise<any> => {
  try {
    console.log()
    const { studentId } = req.body
    console.log(studentId)
    const mentorId = getId("accessToken", req)
    const existRoom = await ChatRoomsModel.findOne({ studentId, mentorId }) as unknown as IChatRooms
    if (existRoom) {
      return res.status(200).send
        ({
          message: "Room Already Exist",
          success: true,
          result: existRoom
        })
    }
    const roomData = {
      studentId,
      mentorId
    }
    const newRoom = new ChatRoomsModel(roomData)
    const createdRoom = await newRoom.save()
    return res.status(200).send
      ({
        message: "Room Created",
        success: true,
        result: createdRoom
      })
  } catch (error: any) {
    console.log('create room error: ', error)
  }
})

//delete for me
app.patch('/delete/message/me/:messageId', async (req: Request, res: Response): Promise<any> => {
  try {
    const { messageId } = req.params
    const findMessage = await MessageModel.findById(messageId) as unknown as IMessages
    findMessage.deletedForSender = true
    await findMessage.save()
    // Check if this is the last message sent by the sender, and update chat room's last message
    const chatRoom = await ChatRoomsModel.findOne({ _id: findMessage.roomId });

    if (chatRoom) {
      const remainingMessages = await MessageModel.find({ roomId: chatRoom._id });
      const validMessages = remainingMessages.filter(msg => !msg.deletedForSender);

      if (validMessages.length > 0) {
        const lastMessage = validMessages[validMessages.length - 1];
        chatRoom.lastMessage = lastMessage.message;
      } else {
        chatRoom.lastMessage = '';  // No valid messages left
      }

      await chatRoom.save();
    }

    return res.status(200)
      .send({
        message: 'Message Deleted For Me',
        success: true,
      })
  } catch (error: any) {
    console.log(error)
  }
})

//reset count
app.patch('/reset/count/:mentorId', async (req: Request, res: Response): Promise<any> => {
  try {
    const { mentorId } = req.params
    const studentId = await getId('accessToken', req)
    const findRoom = await ChatRoomsModel.findOne({ studentId, mentorId }) as unknown as IChatRooms
    findRoom.userMsgCount = 0
    await findRoom.save()

    //find messages
    const findMessages = await MessageModel.find({ roomId: findRoom.id })
    return res
      .status(200)
      .send({
        message: "User Count Reseted",
        success: true,
        result: findMessages
      })
  } catch (error: any) {

  }
})


//////////////////////////// mentors ///////////////////////////////

app.get('/get/students', async (req: Request, res: Response): Promise<any> => {
  try {
    const mentorId = getId("accessToken", req)
    const getUsers = await ChatRoomsModel
      .find({ mentorId })
      .populate({
        path: "studentId",
        select: "_id username profilePicUrl"
      });
    const uniqueStudents = new Set<string>();
    const formatted: any[] = [];

    for (const data of getUsers) {
      const student = data.studentId as unknown as IUser
      if (student && !uniqueStudents.has(student._id.toString())) {
        uniqueStudents.add(student._id.toString());

        // Fetch the chat room for this student and mentor
        const getRoom = await ChatRoomsModel.findOne({
          mentorId,
          studentId: student._id,
        });

        // Add mentor data with lastMessage to the formatted array
        formatted.push({
          studentData: {
            ...student.toObject(), // Convert mentor to a plain object
            lastMessage: getRoom?.lastMessage || null, // Add lastMessage (if any)
          },
        });
      }
    }
    return res.status(200).send
      ({
        message: "Students Got It",
        success: true,
        result: formatted
      })
  } catch (error: any) {
    console.log(error)
  }
})

//get messages
app.get('/get/mentor/messages/:studentId', async (req: Request, res: Response): Promise<any> => {
  try {
    const { studentId } = req.params
    const mentorId = getId("accessToken", req)
    const findRoom = await ChatRoomsModel.findOne({ studentId, mentorId }) as unknown as IChatRooms
    const roomId = findRoom._id
    const findMessages = await MessageModel.find({ roomId })
    return res.send({
      message: "Message Got It",
      success: true,
      result: findMessages
    })
  } catch (error: any) {
    console.log('get message error: ', error)
  }
})

//save message
app.post('/save/mentor/message', async (req: Request, res: Response): Promise<any> => {
  try {
    const { message, studentId } = req.body
    const mentorId = getId("accessToken", req)
    const findRoom = await ChatRoomsModel.findOne({ studentId, mentorId }) as IChatRooms
    findRoom.lastMessage = message
    findRoom.userMsgCount += 1
    await findRoom.save()

    const data: any = {
      senderId: mentorId,
      receiverId: studentId,
      roomId: findRoom?._id,
      message: message,
      senderModel: "Mentors",
      receiverModel: "User"
    }
    const newMessage = new MessageModel(data)
    const savedMessage = await newMessage.save()
    return res.status(200).send
      ({
        message: "Message Saved",
        success: true,
        result: savedMessage
      })
  } catch (error: any) {
    console.log('save messgae error: ', error)
  }
})


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