import mongoose from "mongoose";
import { MONGO_URI } from "../utils/constants";

export async function connectDB (): Promise<void> {
    try {
        await mongoose.connect(MONGO_URI)
        console.log('Mongodb Atlas Connected')
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
