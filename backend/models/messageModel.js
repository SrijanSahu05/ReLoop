import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Converation",
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
    },
    message: { 
        type: String, 
    },
}, {timestamps: true });

export const Message = mongoose.model("Message", messageSchema);