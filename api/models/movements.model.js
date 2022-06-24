import mongoose from "mongoose";

const Schema = mongoose.Schema;

const movementSchema = new Schema({
    from: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    to: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    type: { type: String, required: true },
    amount: { type: Number, required: true },
});

const Movement = mongoose.model("Movement", movementSchema);

export { Movement };
