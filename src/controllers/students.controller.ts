import { Request, Response } from "express";
import UserServices from "../services/userService";
import bcrypt from 'bcrypt'
import { verifyToken } from "../integration/jwt";


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

    //signup user
    public async createUser(req: Request, res: Response): Promise<Response>{
        try{
            let {username, email, phone, password} = req.body
            const saltRound = 10
            const hashedPassword = await bcrypt.hash(password, saltRound)
            password = hashedPassword
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

    // login user
    public async findUser(req: Request, res: Response): Promise<Response>{
        try{
            const {email, password} = req.body
            const response = await this.userServices.findUser({email ,password})
            if(!response){
                console.log('invalid')
                return res.status(400).json({message: 'Invalid Credential'})
            }
            return res.status(201).send({success: true})
        }catch(error){
            console.error('Error while creating user: ', error);
            return res.status(500).json({ message: "An error occurred", error: error });
        }
    }

    // verify student
    public async verifyUser(req: Request, res: Response): Promise<Response> {
        try {
            const tokenFromUser = req.query.token as string; // Get the token from the query parameter
            console.log('Token from user:', tokenFromUser); // Debug log
    
            if (!tokenFromUser) {
                throw new Error('Token not provided in request');
            }
    
            // Verify the token
            const verifiedToken = await verifyToken(tokenFromUser);
            console.log('Verified token:', verifiedToken); // Debug log
    
            if (!verifiedToken.status) {
                throw new Error(verifiedToken.message || 'Token verification failed');
            }
    
            const payload = verifiedToken.payload;
    
            // Ensure payload is valid
            if (!payload || typeof payload !== 'object' || !('id' in payload) || !('email' in payload)) {
                throw new Error('Invalid token payload');
            }
    
            const { email } = payload;
    
            // Verify user using the email
            const response = await this.userServices.verifyUser(email);
            if (!response) {
                throw new Error('User not found or verification failed');
            }
    
            return res.status(201).send({ success: true, message: 'User verified successfully' });
        } catch (error: any) {
            console.error('Error while verifying user: ', error.message);
            return res.status(500).json({ message: "An error occurred", error: error.message });
        }
    }
    
}