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


app.use(cors({
    origin: "*"
}));

connectDatabase().catch(err => console.error("MongoDB connection error:", err));


app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ticket", ticketRoutes);


app.use("/api/inngest", serve({
    client: inngest,
    functions: [onTicketCreated, onUserSignUp]
}));


if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;