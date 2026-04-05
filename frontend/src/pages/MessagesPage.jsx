import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/Chatbox";
import BASE_URL from "../config/api";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentUser?._id) return;

      try {
        // Fetch all conversations for this user
        const res = await axios.get(
          `${BASE_URL}/api/chat/conversations/${currentUser._id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          }
        );

        const convos = res.data.conversations;

        // Fetch the chat partner's details for each conversation
        const conversationsWithPartners = await Promise.all(
          convos.map(async (convo) => {
            const partnerId = convo.members.find((id) => id !== currentUser._id);
            try {
              const userRes = await axios.get(`${BASE_URL}/user/${partnerId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
              });
              return { ...convo, partner: userRes.data.user || userRes.data };
            } catch (err) {
              console.error(`Failed to fetch partner ${partnerId}`, err);
              return { ...convo, partner: { firstName: "Unknown User" } };
            }
          })
        );

        setConversations(conversationsWithPartners);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [currentUser?._id]);

  // Helper function to safely get the image string
  const getImageUrl = (product) => {
    if (!product?.productImg || product.productImg.length === 0) return null;
    const imgData = product.productImg[0];
    const imgString = typeof imgData === "object" ? imgData.path || imgData.url || imgData.filename : imgData;
    if (!imgString) return null;
    return imgString.startsWith("http") ? imgString : `${BASE_URL}/${imgString.replace(/^\//, "")}`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 flex flex-col gap-4">
        <div className="h-8 bg-gray-200 rounded-md w-48 animate-pulse mb-6"></div>
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mb-10 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Messages</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-600">No active conversations</h2>
          <p className="text-gray-400 mt-2">When you contact a seller or a buyer contacts you, the chats will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {conversations.map((convo) => {
            const product = convo.productId;
            const partner = convo.partner;
            const imageUrl = getImageUrl(product);

            return (
              <div
                key={convo._id}
                onClick={() => setActiveChat(convo)}
                className="flex items-center justify-between p-4 bg-white cursor-pointer border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-4">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product?.productName || "Product"}
                      className="w-16 h-16 rounded-xl object-cover border border-gray-100"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-100">
                      <span className="text-gray-400 text-xs">No Img</span>
                    </div>
                  )}

                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                      {product?.productName || "Deleted Product"}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      Chat with: <span className="text-gray-800">{partner?.firstName || "Unknown User"}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Started: {new Date(convo.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveChat(convo);
                  }}
                  className="bg-teal-50 text-teal-600 border border-teal-100 px-5 py-2 rounded-full text-sm font-semibold hover:bg-teal-600 hover:text-white transition-colors duration-200"
                >
                  Open Chat
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeChat && (
        <ChatBox 
          productId={activeChat.productId?._id || activeChat.productId} 
          sellerId={activeChat.partner?._id} 
          onClose={() => setActiveChat(null)} 
        />
      )}
    </div>
  );
};

export default MessagesPage;