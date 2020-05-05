import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    todos: [{ type: Schema.Types.ObjectId, ref: "Todo" }],
});

const UserCollection = mongoose.model("User", userSchema);
export default UserCollection;
