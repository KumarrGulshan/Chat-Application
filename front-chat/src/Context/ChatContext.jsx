import { createContext, useContext as useReactContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const[connected, setConnected] = useState(false);

  return (
    <ChatContext.Provider value={{ roomId, currentUser,connected,  setRoomId, setCurrentUser, setConnected }}>
      {children}
    </ChatContext.Provider>
  );
};

// ✅ Custom hook with unique name
export const useChatContext = () => useReactContext(ChatContext);
