import User from "../models/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import  { validationResult } from 'express-validator' ;

// Register Controller
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const existingUser = await User.findOne({ email });
        console.log(email);
        
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
    

        
     const hashedPassword =  await User.schema.methods.hashPassword(password) ;

     const user = await User.create({ name, email, password: hashedPassword });
     console.log("user registeredS");
     

      return  res.status(201).json({ message: "User registered successfully" });
    } catch (error) {S
        res.status(500).json({ message: "Server error" });
    }
};

// Login Controller
export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findOne({ email })
        
      
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await  user.comparePassword(password)
     
        
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        console.log(user);
        
        const token =  user.generateToken() ;
          
        const usersent  =  await  User.findOne({email}).select('-password');
         
         res.cookie('token', token, { httpOnly: true });

         console.log("user logged in sucessfullyy");
         
        
    
        
     return    res.status(200).json({msg : "user loggend in  sucessfully " ,  user: {usersent} ,  token ,  sucess: true} );
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};



export const logout = (req, res) => {
    console.log("logout");
    
    res.clearCookie('token');
    console.log("user logged out successfully");
    
    res.status(200).json({ message: "User logged out successfully" });
};

// Get Profile Controller
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const verifyAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        return res.status(200).json({ user: req.user });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};
    