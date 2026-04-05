import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { createConversation, getMessages, getUserConversations, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

//Conversation
router.post("/conversation", isAuthenticated, createConversation);

//Messages
router.post('/message', isAuthenticated, sendMessage);
router.get('/message/:conversationId', isAuthenticated, getMessages);

//message list
router.get("/conversations/:userId", isAuthenticated, getUserConversations);

export default router;