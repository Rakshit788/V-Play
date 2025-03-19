import User from "../models/User.model.js";
import jwt from 'jsonwebtoken'; 


const auth = async (req, res, next) => {   
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
      
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    } 
}

export default auth; 