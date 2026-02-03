import mongoose from "mongoose";

export const connectDatabase = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB successfully connected");
    }catch(error){
        console.log("MongoDB erro: ", error);
        process.exit(1);
    }
}