import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import "dotenv/config"

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: "ip.src",
    rules: [
        //shield protects your app from common attacks e.g. SQL injection, XSS ,CSRF attacks
        shield({ mode: "LIVE" })
        , detectBot({
            mode: "LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE"
            ]
        })

        //rate limiting
        , tokenBucket({ mode: "LIVE", refillRate: 5, interval: 10, capacity: 10 })
    ]
})