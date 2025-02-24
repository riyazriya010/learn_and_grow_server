"use strict";
// import fs from "fs";
// import path from "path";
// import morgan from "morgan";
// import { createStream } from "rotating-file-stream";
// // Get the project root directory
// const projectRoot = process.cwd();
// // Define log directories for both `src/` and `dist/`
// const srcLogDirectory = path.join(projectRoot, "src", "logs");
// const distLogDirectory = path.join(projectRoot, "dist", "logs");
// // Ensure both logs directories exist
// [srcLogDirectory, distLogDirectory].forEach((dir) => {
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
// const distLogStream = createStream("access.log", {
//     interval: "7d",
//     path: distLogDirectory,
//     maxFiles: 4,
// });
// // Setup Morgan to log in both locations
// const logger = morgan("combined", {
//     stream: {
//         write: (message) => {
//             srcLogStream.write(message);
//             distLogStream.write(message);
//         },
//     },
// });
// // console.log("Morgan log streams created at:");
// // console.log(" - " + path.join(srcLogDirectory, "access.log"));
// // console.log(" - " + path.join(distLogDirectory, "access.log"));
// export default logger;
