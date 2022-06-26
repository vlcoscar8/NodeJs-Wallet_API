import express from "express";
import { isAuth } from "../../auth/auth.js";
import {
    registerUser,
    logInUser,
    logOutUser,
    getUserDetail,
    sendMoney,
    receiveMoney,
    getAllUsers,
    addFriend,
    removeFriend,
} from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/logout", logOutUser);
router.get("/:id", getUserDetail);
router.get("/", getAllUsers);
router.put("/send", [isAuth], sendMoney);
router.put("/receive/:id", [isAuth], receiveMoney);
router.put("/add/:id", [isAuth], addFriend);
router.put("/remove/:id", [isAuth], removeFriend);

export { router as userRouter };
