import { httpClient } from "../config/AxiosHelper";

// Pass token as optional param (fallback to localStorage)
const getAuthHeader = (token) => {
  const jwt = token || localStorage.getItem("token");
  return jwt ? { Authorization: `Bearer ${jwt}` } : {};
};

// Create a room
export const createRoomApi = async (roomId, token) => {
  try {
    const response = await httpClient.post(
      "/api/v1/rooms",
      roomId,
      {
        headers: {
          "Content-Type": "text/plain",
          ...getAuthHeader(token),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error.response || error);
    throw error;
  }
};

// Join a room
export const joinChatApi = async (roomId, token) => {
  try {
    const response = await httpClient.get(`/api/v1/rooms/${roomId}`, {
      headers: getAuthHeader(token),
    });
    return response.data;
  } catch (error) {
    console.error("Error joining room:", error.response || error);
    throw error;
  }
};

// Get messages
export const getMessages = async (roomId, page = 0, size = 20, token) => {
  try {
    const response = await httpClient.get(`/api/v1/rooms/${roomId}/messages`, {
      params: { page, size },
      headers: getAuthHeader(token),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error.response || error);
    throw error;
  }
};
