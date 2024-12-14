import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import { UserServices } from "../services/userService";

const userServices = new UserServices();

// The controller should be typed to return a Promise of Response.
const signupController = async (req: any, res: any): Promise<any> => {
    try {
        const { username, email, phone, password }: IUser = req.body;

        if (!username || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newUser = await userServices.signUp({ username, email, phone, password });

        return res.status(201).json({
            message: "User created successfully!",
            user: { username: newUser.username, email: newUser.email, phone: newUser.phone },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
};

export default signupController;
