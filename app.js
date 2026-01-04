import express from "express";
import { connectDatabase } from "./database/mongodb";
import cors from "cors";
import userRoutes from "./routers/user.routes.js";
import authRoutes from "./routers/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

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