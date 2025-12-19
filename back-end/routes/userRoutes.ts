
import express from 'express';
import * as userController from '../controllers/userController.js';
import auth from '../middlewares/auth.js'; 

const userRouter = express.Router();


userRouter.post("/login", userController.login);
userRouter.post("/register", userController.register);
userRouter.get("/profile", auth, userController.getProfile);

userRouter.post("/google-login", userController.googleLogin);

export default userRouter;