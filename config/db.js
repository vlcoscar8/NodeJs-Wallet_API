import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config;

const DB_URL = process.env.DB_URL;

const connect = mongoose.connect(
    "mongodb+srv://vlcoscar8:sMZl71f0NTWiHJnA@cluster0.sod8s.mongodb.net/Wallet",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

export { connect };
