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

export const suggested_users = async (req, res) => {
    try {
        const id = req.userId;

        const query = `
        SELECT * FROM users 
        WHERE id != $1 
        AND id NOT IN (
            SELECT UNNEST(followinge) FROM users WHERE id = $1
        )
        ORDER BY RANDOM() 
        LIMIT 8`;

        const users = await pool.query(query, [id]);

        return res.status(200).json(users.rows);
    } catch (error) {
        console.error("Error in get suggested users controller", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const update = async (req, res) => {
    try {
        const { username, email, fullname, bio, avatar, oldPassword, newPassword, cover_img } = req.body;
        const userId = req.userId;

        const getUser = `SELECT * FROM users WHERE id = $1`;
        const { rows } = await pool.query(getUser, [userId]);
        const user = rows[0];

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (email) {
            const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: "Invalid email format" });
            }
        }

        if (newPassword && newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        let hashedPassword = user.password;
        if (newPassword) {
            const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ error: "Old password incorrect" });
            }
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(newPassword, salt);
        }

        if (username && username !== user.username) {
            const getUsername = `SELECT * FROM users WHERE username = $1`;
            const isTakenUsername = await pool.query(getUsername, [username]);
            if (isTakenUsername.rows.length > 0) {
                return res.status(400).json({ error: "Username already taken" });
            }
        }

        if (email && email !== user.email) {
            const getEmail = `SELECT * FROM users WHERE email = $1`;
            const isTakenEmail = await pool.query(getEmail, [email]);
            if (isTakenEmail.rows.length > 0) {
                return res.status(400).json({ error: "Email already taken" });
            }
        }

        const updateQuery = `
            UPDATE users 
            SET 
                username = COALESCE($1, username), 
                email = COALESCE($2, email), 
                fullname = COALESCE($3, fullname), 
                bio = COALESCE($4, bio), 
                avatar = COALESCE($5, avatar), 
                cover_img = COALESCE($6, cover_img), 
                password = $7
            WHERE id = $8
            RETURNING *;
        `;

        const values = [
            username || user.username,
            email || user.email,
            fullname || user.fullname,
            bio || user.bio,
            avatar || user.avatar,
            cover_img || user.cover_img,
            hashedPassword,
            userId
        ];

        const updatedUser = await pool.query(updateQuery, values);

        return res.status(200).json({ message: "User updated successfully", updatedUser: updatedUser.rows[0] });
    } catch (error) {
        console.error("Error in update user controller", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const follow = async (req, res) => {
    const userId = req.userId
    const { id } = req.params

    try {
        const getUser = `SELECT * FROM users WHERE id = $1`

        const userResult = await pool.query(getUser, [id])
        const user = userResult.rows[0]

        const isFollowed = user.followers && user.followers.includes(userId)


        await pool.query("BEGIN")

        if (isFollowed) {
            const following = `
            UPDATE users 
            SET followinge = array_remove(followinge, $1) 
            WHERE id = $2;`
            await pool.query(following, [id, userId])

            const followers = `
            UPDATE users 
            SET followers = array_remove(followers, $2) 
            WHERE id = $1;`
            await pool.query(followers, [id, userId])

            await pool.query("COMMIT")
            return res.status(200).json({ message: "User unfollowed successfully" })

        } else {
            const following = `
            UPDATE users 
            SET followinge = array_append(followinge, $1) 
            WHERE id = $2;`
            await pool.query(following, [id, userId])

            const followers = `
            UPDATE users 
            SET followers = array_append(followers, $2) 
            WHERE id = $1;`
            await pool.query(followers, [id, userId])

            await pool.query("COMMIT")
            return res.status(200).json({ message: "User followed successfully" })
        }
    } catch (error) {
        await pool.query("ROLLBACK")
        console.error("Error in follow controller", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
