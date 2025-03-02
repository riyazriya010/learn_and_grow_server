"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const rotating_file_stream_1 = require("rotating-file-stream");
// Get the project root directory
const projectRoot = process.cwd();
// Define log directories for both `src/`
const srcLogDirectory = path_1.default.join(projectRoot, "src", "logs");
// Ensure both logs directories exist
[srcLogDirectory].forEach((dir) => {
    if (!fs_1.default.existsSync(dir)) {
        console.log("Creating log directory:", dir);
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
});
// Create rotating log streams for both locations
const srcLogStream = (0, rotating_file_stream_1.createStream)("access.log", {
    interval: "7d",
    path: srcLogDirectory,
    maxFiles: 4,
});
// Setup Morgan to log in both locations
const logger = (0, morgan_1.default)("combined", {
    stream: {
        write: (message) => {
            srcLogStream.write(`${message.trim()}\n\n`); // Adds 2 line breaks
        },
    },
});
exports.default = logger;
// import fs from "fs";
// import path from "path";
// import morgan from "morgan";
// import { createStream } from "rotating-file-stream";
// // Get the project root directory
// const projectRoot = process.cwd();
// // Define log directories for both `src/`
// const srcLogDirectory = path.join(projectRoot, "src", "logs");
// // Ensure both logs directories exist
// [srcLogDirectory].forEach((dir) => {
//     if (!fs.existsSync(dir)) {
//         console.log("Creating log directory:", dir);
//         fs.mkdirSync(dir, { recursive: true });
//     }
// });
// // Create rotating log streams for both locations
// const srcLogStream = createStream("access.log", {
//     interval: "7d",
//     path: srcLogDirectory,
//     maxFiles: 4,
// });
// // Setup Morgan to log in both locations
// const logger = morgan("combined", {
//     stream: {
//         write: (message) => {
//             srcLogStream.write(message);
//         },
//     },
// });
// export default logger;
