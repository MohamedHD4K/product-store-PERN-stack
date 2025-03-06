import express from 'express'
import { me, user, users } from '../controllers/users.controller.js'
import protectedEndPoint from '../middleware/protectedEndPoint.js'

const router = express.Router()

router.get("/me", protectedEndPoint, me)

router.get("/:username", protectedEndPoint, user)

router.get("/", users)

export default router