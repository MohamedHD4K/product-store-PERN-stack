import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import productsRouter from "./routers/products.router.js";
import { aj } from "./lib/arcjet.js";
import authRouter from "./routers/auth.router.js";
import usersRouter from "./routers/users.router.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // security middleware    
app.use(morgan("dev")); // logger middleware
app.use(express.json({ limit: "5mb" })); // req.body parser to JSON middleware
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(cors({  origin : "http://localhost:4000" ,credentials: true, }))

// Apply Arcjet rate-limit to all routes
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ error: "Too Many Requests" });
            } else if (decision.reason.isBot()) {
                return res.status(403).json({ error: "Bot access denied" });
            } else {
                return res.status(403).json({ error: "Forbidden" });
            }
        }

        // Check for spoofed bots
        if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            return res.status(403).json({ error: "Spoofed bot detected" });
        }

        next(); // Allow the request to proceed
    } catch (error) {
        console.error("Arcjet error:", error);
        next(error);
    }
});

// Routes
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

// Listener
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
