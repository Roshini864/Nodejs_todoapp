import express from "express"
import userRouter from './routes/user.js'
import taskRouter from './routes/task.js'
import {config} from "dotenv"
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors"

config({
    path: "./data/config.env"
})

export const app = express();
app.use(express.json())
app.use(cookieParser);
app.use(cors({
    origin: [process.env.FRONTEND_URI],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true 
}))

const router = express.Router();

//using routes
app.use("/api/v1/users", userRouter)
app.use("/api/v1/task", taskRouter)


app.get("/", (req, res) => {
    res.send("working noice");
})

app.use(errorMiddleware)