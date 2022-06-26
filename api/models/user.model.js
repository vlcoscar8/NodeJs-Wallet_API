import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cash: { type: Number },
    friends: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
    ],
    movements: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Movement",
        },
    ],
});

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject.password;
    },
});

const User = mongoose.model("User", userSchema);

export { User };
