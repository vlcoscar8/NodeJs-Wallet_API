import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Bank } from "../models/bank.model.js";
import { Movement } from "../models/movements.model.js";
import { User } from "../models/user.model.js";

const registerUser = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        const previousUser = await User.findOne({ email: email });

        if (previousUser) {
            const error = new Error("The user is already registered");
            return next(error);
        }

        const nameUser = await User.findOne({ username: username });

        if (nameUser) {
            const error = new Error(
                "The username is already taken, please try with other username"
            );
            return next(error);
        }
        const passwordHash = await bcrypt.hash(password, 10);

        //Create new User
        const newUser = new User({
            email: email,
            password: passwordHash,
            username: username,
            cash: 0,
        });

        await newUser.save();

        const userRegistered = await User.findOne({
            email: newUser.email,
        });

        return res.status(201).json({
            status: 201,
            message: "User registered successfully!",
            data: userRegistered,
        });
    } catch (error) {
        next(error);
    }
};

const logInUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        const isValidPassword = await bcrypt.compare(
            password,
            user?.password ?? ""
        );

        if (!user || !isValidPassword) {
            const error = new Error("The email or password is incorrect");

            return next(error);
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            req.app.get("secretKey"),
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            userId: user._id,
            token: token,
        });
    } catch (error) {
        next(error);
    }
};

const logOutUser = async (req, res, next) => {
    try {
        req.authority = null;
        return res.json({
            status: 200,
            message: "Logout!",
            token: null,
        });
    } catch (error) {
        next(error);
    }
};

const getUserDetail = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .populate("friends")
            .populate({
                path: "movements",
                model: Movement,
                populate: [
                    {
                        path: "from",
                        model: User,
                    },
                    {
                        path: "to",
                        model: User,
                    },
                ],
            });

        return res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

const sendMoney = async (req, res, next) => {
    try {
        const { from, to, amount } = req.body;

        const currentUserSend = await User.findById(from);
        const currentUserReceive = await User.findOne({ username: to });

        if (currentUserSend.cash < amount) {
            const error = new Error("The user has no money enought to send");

            return next(error);
        }

        const sentUserUpdated = await User.findByIdAndUpdate(from, {
            cash: currentUserSend.cash - amount,
        });

        const receiveUserUpdated = await User.findOneAndUpdate(
            { username: to },
            {
                cash: currentUserReceive.cash + amount,
            }
        );

        //Create new send Movement
        const newSendMovement = new Movement({
            from: currentUserSend,
            to: currentUserReceive,
            type: "send",
            amount: amount,
            currentCash: sentUserUpdated.cash,
        });

        await newSendMovement.save();

        const sendMovement = await Movement.findById(newSendMovement._id)
            .populate("from")
            .populate("to");

        await User.findByIdAndUpdate(from, {
            $push: {
                movements: sendMovement,
            },
        });

        //Create new receive Movement
        const newReceiveMovement = new Movement({
            from: currentUserSend,
            to: currentUserReceive,
            type: "receive",
            amount: amount,
            currentCash: receiveUserUpdated.cash,
        });

        await newReceiveMovement.save();

        const receiveMovement = await Movement.findById(newReceiveMovement._id);

        await User.findOneAndUpdate(
            { username: to },
            {
                $push: {
                    movements: receiveMovement,
                },
            }
        );

        return res.status(200).json(sendMovement);
    } catch (error) {
        next(error);
    }
};

const receiveMoney = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        const currentUser = await User.findById(id);

        const bank = await Bank.find({});

        //Create new receive Movement
        const newReceiveMovement = new Movement({
            from: bank,
            to: currentUser,
            type: "receive",
            amount: amount,
        });

        await newReceiveMovement.save();

        const receiveMovement = await Movement.findById(newReceiveMovement._id);

        await User.findByIdAndUpdate(id, {
            cash: currentUser.cash + amount,
        });

        await User.findByIdAndUpdate(id, {
            $push: {
                movements: receiveMovement,
            },
        });

        const userUpdated = await User.findById(id);

        return res.status(200).json(userUpdated);
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await User.find({});

        return res.status(200).json(allUsers);
    } catch (error) {
        next(error);
    }
};

const addFriend = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { friendUsername } = req.body;

        const friend = await User.findOne({ username: friendUsername });

        if (!friend) {
            return res.status(404).json("User doesn't exist");
        }

        const curretUser = await User.findById(id);

        if (curretUser.friends.includes(friend.id)) {
            return res.status(404).json("The friend is already added");
        }

        await User.findByIdAndUpdate(id, {
            $push: {
                friends: friend,
            },
        });

        const userUpdated = await User.findById(id);

        res.status(200).json(userUpdated);
    } catch (error) {
        next(error);
    }
};

const removeFriend = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { friendUsername } = req.body;

        const friend = await User.findOne({ username: friendUsername });

        if (!friend) {
            return res.status(404).json("User doesn't exist");
        }

        await User.findByIdAndUpdate(id, {
            $pull: {
                friends: friend.id,
            },
        });

        const userUpdated = await User.findById(id);

        res.status(200).json(userUpdated);
    } catch (error) {
        next(error);
    }
};

export {
    registerUser,
    logInUser,
    logOutUser,
    getUserDetail,
    sendMoney,
    receiveMoney,
    getAllUsers,
    addFriend,
    removeFriend,
};
