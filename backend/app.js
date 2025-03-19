import express from 'express'; 
import cors from 'cors';
import { configDotenv } from 'dotenv';
import connectDB from './db.js';
import user_router from './routes/user.route.js';
import videorouter from './routes/viedo.route.js';
import cookieParser from 'cookie-parser';


const app = express(); 

configDotenv() ;

 

app.use(
    cors({
      origin: "http://localhost:3000", // Your frontend URL
      credentials: true, // Allows cookies
    })
  );
app.use(express.urlencoded({ extended: true }));


connectDB() ; 
app.use(express.json());

app.use(cookieParser())

app.use("/api/v1/user" ,  user_router)   ;   
app.use("/api/v1/video" ,  videorouter)   ;  










export default app