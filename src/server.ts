import express, {Request, Response} from 'express'
import { FRONTEND_URL, PORT } from './utils/constants'
import morgan from 'morgan'
import { connectDB } from './config/database'
import cors from 'cors'
import BaseRepository from './repositories/base.repository'
import User from './models/user.model'
import UserRoutes from './routes/user.routes'
// import userRouter from './routes/user.routes'

const app = express()

connectDB()

const corsOptions = {
    origin: FRONTEND_URL() || "*",
    credential: true
}

app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.json())

const userRoutes = new UserRoutes();

app.get('/', async (req: Request, res: Response) => {
    // const baseRepo = new BaseRepository(User)
    // let result = await baseRepo.findByEmail("riyur017@gmail.com")
    // console.log('result: ', result)
    // if(!result){
    //     res.json({message: "user not found"})
    // }
    // res.json({message: "user found"})

    // const newUser = {
    //     username: "Yaseer",
    //     email: "yaseer@email.com",
    //     phone: "1242352525",
    //     password: "1233454"
    // }
    // const baseRepo = new BaseRepository(User)
    // let result = await baseRepo.createUser(newUser)
    // if(!result){
    //     res.json({message: "user not added"})
    // }
    // res.json({message: "user added"})

    res.send('hello')
})

app.get('/createUser', async (req: Request, res: Response) => {
    const newUser = {
        username: "Yaseer",
        email: "yaseer@email.com",
        phone: "1242352525",
        password: "1233454"
    }
    const baseRepo = new BaseRepository(User)
    let result = await baseRepo.createUser(newUser)
    if(!result){
        res.json({message: "user not added"})
    }
    res.json({message: "user added"})
})

app.use("/api/user-service", userRoutes.getRouter())

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
