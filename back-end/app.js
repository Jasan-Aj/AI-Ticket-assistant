import express from "express"
import { connectDatabase } from "./database/mongodb.js";
import cors from "cors";
import userRoutes from "./routers/user.routes.js";
import authRoutes from "./routers/auth.routes.js";
import ticketRoutes from "./routers/ticket.routes.js";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import dotenv from "dotenv";
import {onUserSignUp} from "./inngest/functions/on-sign-up.js";
import {onTicketCreated} from "./inngest/functions/on-ticket-create.js"

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ticket", ticketRoutes);

app.use("/api/inngest",serve({
    client: inngest,
    functions:[onTicketCreated, onUserSignUp]
}));

const startServer = async ()=>{
    try{
        await connectDatabase();
        app.listen(process.env.PORT,()=>{
            console.log(`Server running on PORT: ${process.env.PORT || 3000}`);
        })
    }catch(error){
        console.log(error);
    }
}



startServer();