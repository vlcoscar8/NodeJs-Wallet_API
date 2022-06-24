import express from "express";
import { isAuth } from "../../auth/auth.js";
import {
    registerUser,
    logInUser,
    logOutUser,
    getUserDetail,
    sendMoney,
    receiveMoney,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/logout", logOutUser);
router.get("/:id", getUserDetail);
router.post("/send", [isAuth], sendMoney);
router.put("/receive/:id", [isAuth], receiveMoney);

export { router as userRouter };
