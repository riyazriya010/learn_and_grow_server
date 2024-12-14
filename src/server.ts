import express, {Request, Response} from 'express'
import { FRONTEND_URL, PORT } from './utils/constants'
import morgan from 'morgan'
import { connectDB } from './config/database'
import cors from 'cors'
import userRouter from './routes/user.routes'

const app = express()

connectDB()

const corsOptions = {
    origin: FRONTEND_URL() || "*",
    credential: true
}

app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send("Hello")
})

app.use("/api/user-service",userRouter)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})
