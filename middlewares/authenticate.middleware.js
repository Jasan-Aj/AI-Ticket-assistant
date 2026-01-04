import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const authenticate = async (req, res, next)=>{
    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(" ")[1]; 
        }

        if(!token){
            throw new Error();
        }

        const decoded = jwt.decode(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.uderId);

        if(!user){
            throw new Error();
        }

        req.user = user;
        next();
        
    }catch(error){
        res.status(402).json({
            success: false,
            error: "Not authorized!"
        });
    }
}