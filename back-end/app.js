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
import mongoose from "mongoose";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  process.env.FRONT_END_URL, 
  'https://ai-ticket-assistant-4qfw.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS policy blocked this origin'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options("/*", cors());  // Add the forward slash

// Request logging middleware (optional but helpful for debugging)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  next();
});

// Database connection (don't await - let it run in background)
connectDatabase().catch(err => console.error("MongoDB connection error:", err));

// Database status middleware
app.use((req, res, next) => {
  req.dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ticket", ticketRoutes);

// Inngest routes (commented out - uncomment if you need them)
// app.use("/api/inngest", serve({
//     client: inngest,
//     functions: [onTicketCreated, onUserSignUp]
// }));

// Root route handler - CRITICAL: This was missing!
app.get("/", (req, res) => {
  res.json({
    message: "AI Ticket Assistant API",
    status: "online",
    database: req.dbStatus,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      root: "GET /",
      auth: {
        signIn: "POST /api/auth/sign-in",
        signUp: "POST /api/auth/sign-up",
        // add other auth endpoints
      },
      users: "GET /api/users",
      tickets: "GET /api/ticket",
      inngest: "/api/inngest (commented out)"
    }
  });
});

// Health check endpoint (useful for monitoring)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    database: req.dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.url,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
    path: req.url
  });
});

// Local development server - only runs when not on Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Allowed origins:`, allowedOrigins.filter(Boolean));
  });
}

// Export for Vercel serverless function
export default app;