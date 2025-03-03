import express from "express"
import { createProduct, getProducts, deleteProduct, updateProduct, getProduct } from "../controllers/product.controller.js"


const router = express.Router()

//CRUD
router.get("/", getProducts)

router.get("/:title", getProduct)

router.post("/", createProduct)

router.put("/:id", updateProduct)

router.delete("/:id", deleteProduct)

export default router

