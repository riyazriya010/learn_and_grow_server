import { Request, Response } from "express";
import UserServices from "../services/userService";


export default class UserController {
    private userServices: UserServices

    constructor(){
        this.userServices = new UserServices()
    }

    public async getAllusers(req: Request, res: Response): Promise<Response> {
        try {
            const getUsers = await this.userServices.getAllUsers();

            if (!getUsers || getUsers.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }

            return res.status(200).json(getUsers);
        } catch (error) {
            console.error('Error while getting data: ', error);
            return res.status(500).json({ message: "An error occurred", error: error });
        }
    }

    public async createUser(req: Request, res: Response): Promise<Response>{
        try{
            console.log('user controller - createUser: ', req.body)
            const {username, email, phone, password} = req.body
            const response = await this.userServices.createUser({username, email, phone, password})
            if(!response){
                return res.status(400).json({ message: 'Email already exists' });
            }
            // return res.status(201).json(response);
            return res.status(201).send({ success: true })
        }catch(error){
            console.error('Error while creating user: ', error);
            return res.status(500).json({ message: "An error occurred", error: error });
        }
    }
}