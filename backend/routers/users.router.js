import express from 'express'
import { me, user, users, update, suggested_users, follow } from '../controllers/users.controller.js'
import protectedEndPoint from '../middleware/protectedEndPoint.js'

const router = express.Router()

router.get("/me", protectedEndPoint, me)

router.get("/profile/:username", protectedEndPoint, user)

router.put("/update", protectedEndPoint, update)

router.get("/suggested", protectedEndPoint, suggested_users)

router.put("/follow/:id", protectedEndPoint, follow)

router.get("/", users)

export default router