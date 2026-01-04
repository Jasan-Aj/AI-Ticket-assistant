import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const {name, email, password, skills =[]} = req.body;
        const isUserExist = await User.findOne(email).ession(session);

        if(isUserExist){
            throw new Error("User already exist!");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            email, name, skills, password: hashedPassword
        },{session});

        const token = jwt.sign({userId: user._id, role: user.role},process.env.JWT_SECRET);

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            succes: true,
            message: "user succesfully created",
            data:{
                token,
                user
            }
        });

    }catch(error){
        if(session.inTransaction){
            await session.abortTransaction();
        }
        session.endSession();
        console.log("Error in sign-up: ", error);
        return res.status(500).json({
            success: false,
            error: error
        });
    }
}

export const sigin = async (req, res)=>{

    try{
        const {email, password} = req.body;
        const user = await User.findOne(email);

        if(!user){
            throw new Error("User does not exist!");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword){
            throw new Error("Invalid password!");
        } 

        const token = jwt.sign({userId: user._id, role: user.role});

        return res.status(201).json({
            succes: true,
            message: "user succesfully logged in",
            data:{
                token,
                user
            }
        });

    }catch(error){
        console.log("Error in sign-in: ", error);
        return res.status(500).json({
            success: false,
            error: error
        });
    }
}

export const logout = async (req, res)=>{
    
}

export const updateUser = async (req, res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const {email, skills= [], role} = req.body;
        const user = await User.findOne(email).session(session);
        if(!user){
            throw new Error("user does not exist!");
        }

        await User.updateOne(
            {email},
            {skills: skills.lenght ? skills : user.skills, role:  role ? role: user.role}
        ).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            succes: true,
            message: "user successfully updated!",
            data: {
                user
            }
        });

    }catch(error){
        if(session.inTransaction){
            await session.abortTransaction();
        }
        session.endSession();
        console.log("Error in sign-up: ", error);
        
        return res.status(500).json({
            success: false,
            error: error
        });
    }
}
