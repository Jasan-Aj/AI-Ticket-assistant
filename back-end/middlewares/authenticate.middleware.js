import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const authenticate = async (req, res, next)=>{
    
    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(" ")[1]; 
        }

        if(!token){
            throw new Error("No token exist");
            console.log("no token")
        }

        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if(!user){
            throw new Error("Not authorized");
        }

        req.user = user;
        next();
        
    }catch(error){
        res.status(400).json({
            success: false,
            error: "Not authorized!"
        });
        console.log(error);
    }
}