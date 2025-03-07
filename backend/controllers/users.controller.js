import bcrypt from 'bcryptjs';
import pool from '../config/pg.js'

export const me = async (req, res) => {
    try {
        const id = req.userId

        const getUser = `SELECT * FROM users WHERE id = $1`;
        const user = await pool.query(getUser, [id])

        const { password, ...userWithoutPassword } = user.rows[0];

        return res.status(200).json(userWithoutPassword)
    } catch (error) {
        console.log("Error in get me data", error)
        return res.status(500).json({ error: "Internel server error" })
    }
}

export const user = async (req, res) => {
    try {
        const { username } = req.params
        const name = username.split("@").join("")

        const getUser = `SELECT * FROM users WHERE username = $1`;
        const user = await pool.query(getUser, [name])

        const { password, ...userWithoutPassword } = user.rows[0];

        return res.status(200).json(userWithoutPassword)
    } catch (error) {
        console.log("Error in get user data", error)
        return res.status(500).json({ error: "Internel server error" })
    }
}

export const users = async (req, res) => {
    try {
        const query = `SELECT * FROM users`

        const users = await pool.query(query)

        return res.status(200).json(users.rows)
    } catch (error) {
        console.log("Error in get users controller", error);
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const update = async (req, res) => {
    try {
        const { username, email, fullname, bio, avatar, oldPassword, newPassword } = req.body;
        const userId = req.userId;

        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (newPassword && newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const getUser = `SELECT * FROM users WHERE id = $1`;
        const { rows } = await pool.query(getUser, [userId]);
        const user = rows[0];

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Old password incorrect" });
        }

        let hashedPassword = user.password;
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(newPassword, salt);
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

        const updateQuery = `
            UPDATE users 
            SET username = $1, email = $2, fullname = $3, bio = $4, avatar = $5, password = $6
            WHERE id = $7
        `;
        const values = [username, email, fullname, bio, avatar, hashedPassword, userId];

        const updatedUser = await pool.query(updateQuery, values);

        return res.status(200).json({ message: "User updated successfully", updatedUser: updatedUser.rows[0] });
    } catch (error) {
        console.log("Error in update user controller", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
