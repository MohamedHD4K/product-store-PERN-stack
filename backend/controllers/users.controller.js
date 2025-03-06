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