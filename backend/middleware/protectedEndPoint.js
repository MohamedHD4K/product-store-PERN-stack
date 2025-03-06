import jwt from "jsonwebtoken"

const protectedEndPoint = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.userId = decoded.userId

        next()
    } catch (error) {
        console.log("Error in protected endpoint", error);
        return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
}

export default protectedEndPoint