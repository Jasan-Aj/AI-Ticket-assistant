import express from "express";
import { connectDatabase } from "./database/mongodb.js";
import cors from "cors";
import userRoutes from "./routers/user.routes.js";
import authRoutes from "./routers/auth.routes.js";
import ticketRoutes from "./routers/ticket.routes.js";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import dotenv from "dotenv";
import { onUserSignUp } from "./inngest/functions/on-sign-up.js";
import { onTicketCreated } from "./inngest/functions/on-ticket-create.js";

dotenv.config();

const app = express();

app.use(express.json());

// MANUAL CORS HEADERS
app.use((req, res, next) => {
  // Set the origin to your exact frontend URL
  res.header("Access-Control-Allow-Origin", "https://ai-ticket-assistant-4qfw.vercel.app");
  
  // Necessary if you are using cookies or sessions
  res.header("Access-Control-Allow-Credentials", "true");
  
  // Methods the browser is allowed to use
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Headers the browser is allowed to send
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  // HANDLES THE PREFLIGHT CHECK
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(cors({
  origin:'https://ai-ticket-assistant-4qfw.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'OPTIONS']
}));

connectDatabase().catch(err => console.error("MongoDB connection error:", err));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ticket", ticketRoutes);


app.use("/api/inngest", serve({
    client: inngest,
    functions: [onTicketCreated, onUserSignUp]
}));

app.get("/",(req, res)=>{
    res.json({
        message: "wellcome"
    })
});


if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;