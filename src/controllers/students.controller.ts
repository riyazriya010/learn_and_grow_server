import { Request, Response } from "express";
import UserServices from "../services/userService";
import bcrypt from 'bcrypt'
import { verifyToken } from "../integration/mailToken";


export default class UserController {
    private userServices: UserServices

    constructor(){
        this.userServices = new UserServices()
    }

    public async getAllusers(req: Request, res: Response): Promise<void> {
        try {
            const getUsers = await this.userServices.getAllUsers();

            if (!getUsers || getUsers.length === 0) {
                 res.status(404).json({ message: "No users found" , success: false});
            }

             res.status(200).json({user: getUsers, message: 'Users found', success: true});

        } catch (error) {
            console.error('Error while getting data: ', error);
             res.status(500).json({ message: "An error occurred", error: error });
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
            if(response){
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
            const userData = await this.userServices.findByEmail(email)
            if(!userData){
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

    public async googleLogin(req: Request, res: Response): Promise<Response> {
        try {
            const { email, displayName } = req.body
            const googleUser = await this.userServices.googleUser(email, displayName)
            console.log(googleUser)

            if (!googleUser) {
                return res.status(400).json({ message: 'Error Accord in Google signin' });
            }
            return res.status(201).send({ success: true })

        } catch (error: any) {
            console.error('Error while verifying user: ', error.message);
            return res.status(500).json({ message: "An error occurred", error: error.message });
        }
    }
    

    // new methods
    public async studentSignup(req: Request, res: Response): Promise<any> {
        try {
            let { username, email, phone, password } = req.body

            const saltRound = 10
            const hashPassword = await bcrypt.hash(password, saltRound)
            password = hashPassword

            const ExistUser = await this.userServices.findByEmail(email)
            if(ExistUser){
                console.log('Existtttttt')
                // return res.status(409).json({message: 'User Already Exist', success: false})
                return res.send({message: 'User Already Exist', success: true, status: 409})
            }
            console.log('after exitttt')
            const addStudent = await this.userServices.studentSignup({username, email, phone, password})

            return res.send({user: addStudent, message: 'User Successfully Added', success: true})

        } catch (error) {
            console.error(error)
        }
    }


    public async studentGoogleSignIn(req: Request, res: Response): Promise<any> {
        try{
            const { email, displayName } = req.body

            const ExistUser = await this.userServices.findByEmail(email)
            if(ExistUser){
                return res.send({message: 'User Already Exist', success: true, status: 409})
            }

            const addStudent = await this.userServices.studentGoogleSignIn(email, displayName)

            return res.send({user: addStudent, message: 'User Successfully Added', success: true})

        }catch(error: any){
            console.error(error.message)
        }
    }

    public async studentLogin(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body
            const loggedUser = await this.userServices.studentLogin(email, password)

            if(loggedUser === null){
                return res.status(401).send({message: 'Invalid Credentials', success: false})
            }

            return res.send({message: 'User Logged Successfully', success: true, status: 200})

        } catch (error) {
            console.error(error)
        }
    }
}


