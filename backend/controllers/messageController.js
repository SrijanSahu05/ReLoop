import { Conversation } from "../models/conversation.js";
import { Message } from "../models/messageModel.js";

// 1. Get Conversation (Returns null if none exists yet)
export const createConversation = async (req, res) => {
  try {
    const { senderId, receiverId, productId } = req.body;

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
      productId,
    });

    return res.status(200).json({
      success: true,
      conversation: conversation || null,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 2. Send Message (Safely creates conversation on first message)
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, sender, receiverId, productId, message } = req.body;

    let activeConversationId = conversationId;

    // FIX: Safely check for existing conversation, or create a new one. 
    // This avoids the MongoDB $all upsert crash.
    if (!activeConversationId) {
      let existingConvo = await Conversation.findOne({
        members: { $all: [sender, receiverId] },
        productId,
      });

      if (!existingConvo) {
        const newConvo = new Conversation({
          members: [sender, receiverId],
          productId,
        });
        existingConvo = await newConvo.save();
      }
      
      activeConversationId = existingConvo._id;
    }
    
    // Save the new message
    const newMessage = new Message({
      conversationId: activeConversationId,
      sender,
      message,
    });

    const savedMessage = await newMessage.save();

    // Update the conversation's timestamp so this chat moves to the top!
    await Conversation.findByIdAndUpdate(activeConversationId, { 
      updatedAt: new Date() 
    });

    return res.status(200).json({
      success: true,
      savedMessage,
      conversationId: activeConversationId,
    });

  } catch (error) {
    console.error("SendMessage Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. Get Messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 4. Get user conversations (for message list UI)
export const getUserConversations = async (req, res) => {
  try {
    // Show newest chats first
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    })
      .populate("productId")
      .sort({ updatedAt: -1 });

    // Remove any ghost/empty conversations
    const activeConversations = [];
    for (const convo of conversations) {
      const hasMessages = await Message.findOne({ conversationId: convo._id });
      if (hasMessages) {
        activeConversations.push(convo);
      }
    }

    return res.status(200).json({
      success: true,
      conversations: activeConversations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};