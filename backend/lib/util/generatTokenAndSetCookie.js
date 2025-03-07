import jwt from "jsonwebtoken"

function generatTokenAndSetCookie(userId, res) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    })
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //MS
        httpOnly: true, // XSS Attack
        sameSite: "strict", //CSRF Attack
        secure: process.env.NODE_ENV !== "development",
    });

    console.log("Set-Cookie header:", res.getHeaders()["set-cookie"]); // Debugging
}

export default generatTokenAndSetCookie