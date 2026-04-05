let users = [];

// Add user
const addUser = (userId, socketId) => {
  users = users.filter((user) => user.userId !== userId);
  users.push({ userId, socketId });
};

// Remove user
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

// Get user
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Add user when they open app
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    // Send message
    // Destructure `conversationId` and pass it back to the receiver
    socket.on("sendMessage", ({ senderId, receiverId, message, conversationId }) => {
      const user = getUser(receiverId);

      if (user) {
        io.to(user.socketId).emit("getMessage", {
          senderId,
          message,
          conversationId, // Sending this ensures the frontend knows which chat window to put it in
        });
      } else {
        console.log("Receiver not connected:", receiverId);
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
};

export default socketHandler;