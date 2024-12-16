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
// import userRouter from './routes/user.routes'
const app = (0, express_1.default)();
(0, database_1.connectDB)();
const corsOptions = {
    origin: (0, constants_1.FRONTEND_URL)() || "*",
    credential: true
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const userRoutes = new students_routes_1.default();
app.use("/api/user-service", userRoutes.getRouter());
app.listen(constants_1.PORT, () => {
    console.log(`Server is running on ${constants_1.PORT}`);
});
