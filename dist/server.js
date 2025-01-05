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
const certificate_model_1 = require("./models/certificate.model");
const app = (0, express_1.default)();
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
// Global error handler (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', success: false });
});
// certificate
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = '676a9f2a339270ae95450b75'; // Replace with actual user ID from your database
        const courseId = '67710140df708808ce0fd712'; // Replace with actual course ID from your database
        const courseName = 'JavaScript'; // Replace with course name
        const userName = 'Riyas'; // Replace with user name
        const issuedDate = new Date(); // Current date
        // Create a new certificate
        const certificate = new certificate_model_1.CertificateModel({
            userId,
            courseId,
            courseName,
            userName,
            issuedDate,
        });
        // Save the certificate to the database
        const savedCertificate = yield certificate.save();
        return res.status(201).json({
            message: 'Certificate created successfully!',
            data: savedCertificate,
        });
    }
    catch (error) {
        console.error('Error creating certificate:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.use("/api/user-service", students_routes_1.default);
app.use("/api/mentor-service", mentors_routes_1.default);
app.use("/api/admin-service", admin_routes_1.default);
app.listen(constants_1.PORT, () => {
    console.log(`Server is running on ${constants_1.PORT}`);
});
