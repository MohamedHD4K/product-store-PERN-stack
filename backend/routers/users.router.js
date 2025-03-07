import express from 'express'
import { me, user, users , update } from '../controllers/users.controller.js'
import protectedEndPoint from '../middleware/protectedEndPoint.js'

const router = express.Router()

router.get("/me", protectedEndPoint, me)

router.get("/:username", protectedEndPoint, user)

router.put("/:update", protectedEndPoint, update)

router.get("/", users)

export default router