import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 8002

// export const MONGO_URI = () => {
//     if(!process.env.MONGO_URI) throw new Error("Mongo URI not found in env");
//     return String(process.env.MONGO_URI)
// }

// export const FRONTEND_URL = () => {
//     if (!process.env.FRONTEND_URL) return null;
//     return String(process.env.FRONTEND_URL);
//   };

  export const MONGO_URI: string = String(process.env.MONGO_URI)
  export const FRONTEND_URL: string = String(process.env.FRONTEND_URL)
  export const JWT_SECRET: string = String(process.env.JWT_SECRET)
  