import express from "express";
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
router.post("/send", sendMoney);
router.put("/receive/:id", receiveMoney);

export { router as userRouter };
