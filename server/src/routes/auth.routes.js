import { Router } from 'express'
import {
    loginUser,
    logoutUser,
    registerUser
} from "../controllers/auth.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js" 


const router = Router();

//router for registering a new user
router.post('/register', registerUser)
router.post('/login', loginUser);
router.route("/logout").post(verifyJWT, logoutUser);


export default router;