import express from "express";
import { connectDatabase } from "./database/mongodb";
import cors from "cors"

const app = express();

app.use(cors());
app.use(express.json());

const startServer = async ()=>{
    try{
        await connectDatabase();
        application.listen(process.env.PORT,()=>{
            console.log(`Server running on PORT: ${process.env.PORT || 3000}`);
        })
    }catch(error){
        console.log(error);
    }
}

startServer();