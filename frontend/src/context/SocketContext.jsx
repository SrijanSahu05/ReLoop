import { useEffect, useState, createContext } from "react";
import { io } from "socket.io-client";
import BASE_URL from "../config/api";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket
    const newSocket = io(`${BASE_URL}`);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?._id) {
        newSocket.emit("addUser", user._id);
      }
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};