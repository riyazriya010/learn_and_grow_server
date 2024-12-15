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
const base_repository_1 = __importDefault(require("./repositories/base.repository"));
const user_model_1 = __importDefault(require("./models/user.model"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
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
const userRoutes = new user_routes_1.default();
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const baseRepo = new BaseRepository(User)
    // let result = await baseRepo.findByEmail("riyur017@gmail.com")
    // console.log('result: ', result)
    // if(!result){
    //     res.json({message: "user not found"})
    // }
    // res.json({message: "user found"})
    // const newUser = {
    //     username: "Yaseer",
    //     email: "yaseer@email.com",
    //     phone: "1242352525",
    //     password: "1233454"
    // }
    // const baseRepo = new BaseRepository(User)
    // let result = await baseRepo.createUser(newUser)
    // if(!result){
    //     res.json({message: "user not added"})
    // }
    // res.json({message: "user added"})
    res.send('hello');
}));
app.get('/createUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = {
        username: "Yaseer",
        email: "yaseer@email.com",
        phone: "1242352525",
        password: "1233454"
    };
    const baseRepo = new base_repository_1.default(user_model_1.default);
    let result = yield baseRepo.createUser(newUser);
    if (!result) {
        res.json({ message: "user not added" });
    }
    res.json({ message: "user added" });
}));
app.use("/api/user-service", userRoutes.getRouter());
app.listen(constants_1.PORT, () => {
    console.log(`Server is running on ${constants_1.PORT}`);
});
