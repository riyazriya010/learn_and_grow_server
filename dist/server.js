"use strict";
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
app.use("/api/user-service", students_routes_1.default);
app.use("/api/mentor-service", mentors_routes_1.default);
app.use("/api/admin-service", admin_routes_1.default);
app.listen(constants_1.PORT, () => {
    console.log(`Server is running on ${constants_1.PORT}`);
});
