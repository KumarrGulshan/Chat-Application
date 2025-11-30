import { createContext, useContext as useReactContext, useState, useEffect } from "react";

// Decode username from JWT
function decodeToken(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload))?.sub || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUser, setCurrentUser] = useState("");
  const [roomId, setRoomId] = useState("");
  const [connected, setConnected] = useState(false);

  // Sync token and update username
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      const username = decodeToken(token);
      if (username) setCurrentUser(username);
    } else {
      localStorage.removeItem("token");
      setCurrentUser("");
    }
  }, [token]);

  return (
    <ChatContext.Provider
      value={{
        token,
        setToken,
        currentUser,
        setCurrentUser,
        roomId,
        setRoomId,
        connected,
        setConnected
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useReactContext(ChatContext);
