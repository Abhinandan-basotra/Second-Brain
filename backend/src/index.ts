import express, { Application } from 'express';
import dotenv from 'dotenv';
import { connectDb } from './utils/db';
import userRoute  from './routers/user.router';
import contentRoute from './routers/content.router'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config({})
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}
app.use(cors(corsOptions))

app.use(cookieParser())

app.use('/api/v1/', userRoute);
app.use('/api/v1/', contentRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}.`);
    connectDb();
})
