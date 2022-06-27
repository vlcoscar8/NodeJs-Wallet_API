import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bankSchema = new Schema({
    username: { type: String, required: true },
});

const Bank = mongoose.model("Bank", bankSchema);

export { Bank };
