import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }
}, {timestamps: true });

export const Conversation = mongoose.model("Conversation", conversationSchema);
