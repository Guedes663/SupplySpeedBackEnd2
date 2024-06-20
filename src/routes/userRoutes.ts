import express from "express";
import { UserController } from "../Controller/UserController";
import { UserBusiness } from "../Business/UserBusiness";
import { UserData } from "../Data/UserData";

const userRoutes = express.Router();

const userData = new UserData();
const userBusiness = new UserBusiness(userData);
const userController = new UserController(userBusiness);

userRoutes.post("/signup", userController.registerUser);
userRoutes.post("/login", userController.login);
userRoutes.get("/search/:numPage", userController.searchInformation);
userRoutes.get("/profile/:idProfile", userController.getProfileInformation.bind(userController));

export { userRoutes };