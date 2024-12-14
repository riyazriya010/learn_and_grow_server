import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT || 8002

export const MONGO_URI = () => {
    if(!process.env.MONGO_URI) throw new Error("Mongo URI not found in env");
    return String(process.env.MONGO_URI)
}

export const FRONTEND_URL = () => {
    if (!process.env.FRONTEND_URL) return null;
    return String(process.env.FRONTEND_URL);
  };
