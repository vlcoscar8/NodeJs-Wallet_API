import express from "express";
import dotenv from "dotenv";

dotenv.config();

const server = express();
const router = express.Router();
const PORT = process.env.PORT;

server.use("/", router);

router.get("/", (req, res) => {
    res.send("Hello World");
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
