import pool from "../config/pg.js"

export const getProducts = async (req, res) => {
    try {
        const query = `SELECT * FROM products;`
        const products = await pool.query(query)

        return res.status(200).json(products.rows)
    } catch (error) {
        console.log("Error getProduct", error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getProduct = async (req, res) => {
    try {
        const { title } = req.params

        const query = `SELECT * FROM products WHERE title=$1;`
        const products = await pool.query(query, [title])

        return res.status(200).json(products.rows)
    } catch (error) {
        console.log("Error getProduct", error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const createProduct = async (req, res) => {
    try {
        const { title, description, price, image } = req.body
        console.log(req.body);
        const query = `
        INSERT INTO products (title, description, price, image)
        VALUES ($1, $2, $3, $4);`

        const values = [title, description, price, image]

        const newProduct = await pool.query(query, values)

        return res.status(201).json({ message: 'Product added successfully', product: newProduct })
    } catch (error) {
        console.log("Error createProduct", error);
        return res.status(500).json({ message: "Internal server error" })
    }

}

export const updateProduct = async (req, res) => {
    try {
        const { title, description, price, image } = req.body
        const { id } = req.params

        const query = `UPDATE products SET title = $1, description = $2, price = $3, image = $4 WHERE id = $5;`

        const values = [title, description, price, image, id]

        const updatedProduct = await pool.query(query, values)

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct })

    } catch (error) {
        console.log("Error updateProduct", error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const query = `DELETE FROM products WHERE id=$1`
        const deleteProduct = await pool.query(query, [id])

        res.status(200).json({ message: 'Product deleted successfully', product: deleteProduct })

    } catch (error) {
        console.log("Error deleteProduct", error);
        return res.status(500).json({ message: "Internal server error" })
    }
}