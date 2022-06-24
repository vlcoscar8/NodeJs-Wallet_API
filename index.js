import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import { connect } from "./config/db.js";
import { userRouter } from "./api/routes/user.routes.js";

// Config API
dotenv.config();
const server = express();
const router = express.Router();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;
server.set("secretKey", "nodeRestApi");
//Cors
server.use(
    cors({
        origin: `*`,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

//Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Session users Mongo

server.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000,
        },
        store: MongoStore.create({
            mongoUrl: DB_URL,
        }),
    })
);

// Routes
server.use("/", router);
server.use("/user", userRouter);

//Errors
server.use("*", (req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});

server.use((error, req, res, next) => {
    return res
        .status(error.status || 500)
        .json(error.message || "Unexpected error");
});

// Run server on localhost
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
