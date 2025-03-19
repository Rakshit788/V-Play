import User from "../models/User.model.js";
import { Router } from "express";
import { body } from "express-validator";
import { register , login , logout , getProfile , verifyAuth } from "../controllers/User.controller.js";
import auth from "../middleware/auth.middleware.js";


const user_router = Router(); 

user_router.post("/register", [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 characters long')
], register);

user_router.post("/login", [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 characters long')
], login);


user_router.get('/logout', auth, logout);

user_router.get('/profile', auth, getProfile); 

user_router.get('/verify', auth, verifyAuth);


export  default  user_router  ;  


