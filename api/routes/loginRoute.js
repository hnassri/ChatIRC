import express from 'express'
import { loginUser} from "../controller/loginController.js";
const router = express.Router()


// express router method to create route for getting all users
router.post('/login', loginUser)


export default router