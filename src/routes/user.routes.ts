import { Request, Response, Router } from "express";
import UserController from "../controllers/user.controller";
import { validateUser } from "../middleware/validateUser";

export default class UserRoutes {
    private router: Router
    private userContorller: UserController

    constructor(){
        this.router = Router()
        this.userContorller = new UserController()
        this.initializeRoutes() // Set up routes
    }

    private initializeRoutes(){
        this.router.get('/getUser', async (req: Request, res: Response) => { 
            await this.userContorller.getAllusers(req, res) 
        })

        this.router.post('/signup', async (req: Request, res: Response) => {
            console.log('user routes - post: ')
            await this.userContorller.createUser(req, res)
        })
    }

    public getRouter() {
        return this.router; // Expose the router
    }
}