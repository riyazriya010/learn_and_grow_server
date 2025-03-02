import fs from "fs";
import path from "path";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";

// Get the project root directory
const projectRoot = process.cwd();

// Define log directories for both `src/`
const srcLogDirectory = path.join(projectRoot, "src", "logs");

// Ensure both logs directories exist
[srcLogDirectory].forEach((dir) => {
    if (!fs.existsSync(dir)) {
        console.log("Creating log directory:", dir);
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Create rotating log streams for both locations
const srcLogStream = createStream("access.log", {
    interval: "7d",
    path: srcLogDirectory,
    maxFiles: 4,
});

// Setup Morgan to log in both locations
const logger = morgan("combined", {
    stream: {
        write: (message) => {
            srcLogStream.write(`${message.trim()}\n\n`); // Adds 2 line breaks
        },
    },
});


export default logger;








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
