import express from 'express'
import { registerUser } from "../controller/registerController.js";
const router = express.Router()


// express router method to create route for getting all users
router.post('/register', registerUser)


export default router