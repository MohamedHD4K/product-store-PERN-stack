import dotenv from "dotenv"
import express from "express"
import morgan from "morgan"
import cors from "cors"
import helmet from "helmet"
import productsRouter from "./routers/products.router.js"
import { request } from "http"
import {aj} from "./lib/arcjet.js"

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3001

//Middleware
app.use(helmet()) // security middleware    
app.use(morgan("dev")) // logger middleware
app.use(express.json()) // req.body parser to json middleware
app.use(cors()) // cors middleware

// apply arcjet rate-limit to all routes
// app.use(async (req, res, next) => {
//     try {
//         const decistion = await aj.protect(req, {
//             requested: 1
//         })

//         if (decistion.isDenied()) {
//             if (decistion.reason.isRateLimit()) {
//                 return res.status(429).json({ error: "Too Many Requests" })
//             } else if (decistion.reason.isBot()) {
//                 return res.status(403).json({ error: "Bot access denied" })
//             } else {
//                 return res.status(403).json({ error: "Forbidden" });
//             }
//             //the spoofed bots act when the bot trying to act like humen
//         } else if (decistion.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
//             return res.status(403).json({ error: "Spoofed bot detected" });
//         } 
//     } catch (error) {
//         console.log("Arcjet error", error);
//         next(error)
//     }
// })

//Routes
app.use("/api/products", productsRouter)

//Listener
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});