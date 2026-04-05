import React, { useContext, useEffect, useState, useRef } from "react";
import { SocketContext } from "../context/SocketContext";
import axios from "axios";
import { X } from "lucide-react";
import BASE_URL from "../config/api";

const ChatBox = ({ productId, sellerId, onClose }) => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [productDetails, setProductDetails] = useState(null);
  const [chatPartner, setChatPartner] = useState(null);

  const scrollRef = useRef();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const socket = useContext(SocketContext);

  // Register the user to the socket server when they open the chat.
  useEffect(() => {
    if (socket && currentUser) {
      socket.emit("addUser", currentUser._id);
    }
  }, [socket, currentUser]);

  // Create or Get Conversation
  useEffect(() => {
    const createConversation = async () => {
      try {
        const res = await axios.post(
          `${BASE_URL}/api/chat/conversation`,
          {
            senderId: currentUser._id,
            receiverId: sellerId,
            productId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setConversation(res.data.conversation);
      } catch (err) {
        console.error(err);
      }
    };

    if (currentUser && sellerId && productId) {
      createConversation();
    }
  }, [currentUser?._id, sellerId, productId]);

  // Fetch Product and Seller Details
  useEffect(() => {
    const fetchHeaderDetails = async () => {
      if (productId && !productDetails) {
        try {
          const prodRes = await axios.get(
            `${BASE_URL}/product/${productId}`
          );
          const productData = prodRes.data.viewSingleProduct || prodRes.data;

          setProductDetails(productData);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      }

      const partnerId =
        conversation?.members?.find((member) => member !== currentUser._id) ||
        sellerId;

      if (partnerId && !chatPartner) {
        try {
          const userRes = await axios.get(
            `${BASE_URL}/user/${partnerId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );

          setChatPartner(userRes.data.user || userRes.data);
        } catch (error) {
          console.error("Error fetching chat partner details:", error);
        }
      }
    };

    fetchHeaderDetails();
  }, [productId, conversation, sellerId, currentUser._id]);

  // Load Messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/chat/message/${conversation._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const msgs = res.data.messages || res.data;
        setMessages(msgs);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
      }
    };

    if (conversation?._id) fetchMessages();
  }, [conversation?._id]);

  // Real-time receive
  useEffect(() => {
    if (!socket || !conversation?._id) return;

    const handleGetMessage = (data) => {
      if (data.conversationId === conversation?._id) {
        setMessages((prev) => [
          ...prev,
          {
            sender: data.senderId,
            message: data.message,
          },
        ]);
      }
    };

    socket.on("getMessage", handleGetMessage);

    return () => socket.off("getMessage", handleGetMessage);
  }, [socket, conversation?._id]);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const handleSend = async () => {
    if (!message.trim()) return;

    const messageText = message;
    setMessage("");

    const receiverId =
      conversation?.members?.find((member) => member !== currentUser._id) ||
      sellerId;

    try {
      setMessages((prev) => [
        ...prev,
        {
          sender: currentUser._id,
          message: messageText,
        },
      ]);

      const res = await axios.post(
        `${BASE_URL}/api/chat/message`,
        {
          conversationId: conversation?._id || null,
          sender: currentUser._id,
          receiverId: receiverId,
          productId: productId,
          message: messageText,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const activeConversationId = res.data.conversationId;

      socket?.emit("sendMessage", {
        senderId: currentUser._id,
        receiverId: receiverId,
        message: messageText,
        conversationId: activeConversationId,
      });

      if (!conversation) {
        setConversation({
          _id: activeConversationId,
          members: [currentUser._id, receiverId],
          productId: productId,
        });
      }
    } catch (error) {
      console.error(
        "Failed to send message:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-[600px] max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden animate-scaleIn relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 bg-white border-b border-gray-200 flex items-center gap-3 z-20 shadow-sm relative">
          
          {/* Product Image */}
          {productDetails?.productImg && productDetails.productImg.length > 0 ? (
            <img
              src={(() => {
                const imgData = productDetails.productImg[0];
                if (!imgData) return "";

                const imgString =
                  typeof imgData === "object"
                    ? imgData.path || imgData.url || imgData.filename
                    : imgData;

                if (!imgString) return "";
                return imgString.startsWith("http")
                  ? imgString
                  : `${BASE_URL}/${imgString.replace(/^\//, "")}`;
              })()}
              alt={productDetails.productName || "Product"}
              className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 animate-pulse border border-gray-200 flex-shrink-0"></div>
          )}

          {/* Info */}
          <div className="flex flex-col justify-center overflow-hidden flex-1">
            <h2 className="text-[1rem] font-bold text-gray-800 leading-tight tracking-tight truncate">
              {productDetails?.productName || "Loading Product..."}
            </h2>
            <span className="text-xs text-gray-500 font-medium mt-0.5 truncate">
              Chatting with:{" "}
              <span className="text-gray-900 font-semibold">
                {chatPartner?.firstName || "Loading..."}
              </span>
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-800 rounded-full transition-colors focus:outline-none"
            title="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f0f2f5] shadow-inner relative z-0">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === currentUser._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] text-[0.9rem] leading-relaxed shadow-sm ${
                  msg.sender === currentUser._id
                    ? "bg-teal-600 text-white rounded-br-sm"
                    : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-200 flex gap-2 items-center z-20 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all placeholder-gray-400"
          />

          <button
            onClick={handleSend}
            className="bg-teal-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm active:scale-95 transform duration-150 ease-in-out"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;