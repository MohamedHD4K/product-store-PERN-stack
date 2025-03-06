import pool from "../config/pg.js";
import bcryptjs from 'bcryptjs';
import generatTokenAndSetCookie from '../lib/util/generatTokenAndSetCookie.js'

export const signup = async (req, res) => {
    const { username, email, password, fullname, avatar, bio } = req.body;
    try {
        const query = `INSERT INTO users (username , password, email, fullname, avatar, bio)
        VALUES ($1, $2, $3, $4, $5, $6)`;

        if (!username || !email || !password || !fullname) {
            return res.status(400).json({ error: "username, email, password, and fullname are required" });
        }

        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const getUsername = `SELECT * FROM users WHERE username = $1`;
        const isTakenUsername = await pool.query(getUsername, [username]);
        if (isTakenUsername.rows.length > 0) {
            return res.status(400).json({ error: "Username already taken" });
        }

        const getEmail = `SELECT * FROM users WHERE email = $1`;
        const isTakenEmail = await pool.query(getEmail, [email]);
        if (isTakenEmail.rows.length > 0) {
            return res.status(400).json({ error: "Email already taken" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const values = [username, hashedPassword, email, fullname, avatar, bio];
        await pool.query(query, values);

        const getUser = `SELECT * FROM users WHERE username = $1`;
        const user = await pool.query(getUser, [username])

        generatTokenAndSetCookie(user.rows.id, res)

        console.log("New user:", user.rows);
        return res.status(201).json({ message: "User signed up successfully", user: user.rows });
    } catch (error) {
        console.log("Error in signup controller", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        console.log("Logout successfully");
        return res.status(201).json({ message: "User logout successfully" });
    } catch (error) {
        console.log("Error in logout controller", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const getUserQuery = `SELECT * FROM users WHERE username = $1`;
        const userResult = await pool.query(getUserQuery, [username]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "Username or password is incorrect" });
        }

        const user = userResult.rows[0];

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Username or password is incorrect" });
        }

        generatTokenAndSetCookie(user.id, res);

        console.log("User:", user);
        return res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
        console.error("Error in login controller:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};