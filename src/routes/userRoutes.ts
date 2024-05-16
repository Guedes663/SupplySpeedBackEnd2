import express from "express";
import { UserController } from "../Controller/UserController";
import { UserBusiness } from "../Business/UserBusiness";

const userRoutes = express.Router();

const userBusiness = new UserBusiness();
const userController = new UserController(userBusiness);

userRoutes.post('/signup/', userController.registerUser);

export { userRoutes };