// super
// hey
// damn
import { httpClient } from "../config/AxiosHelper";
export const createRoomApi = async (roomDetail) => {
    const response = await httpClient.post('/api/v1/rooms',roomDetail,{
        headers: {
            "Content-Type" : "text/plain",
        }
    });
    return response.data;
};

export const joinChatApi = async (roomId) => {
    const response = await httpClient.get(`/api/v1/rooms/${roomId}`,roomId);
     return response.data;
}

export const getMessages = async (roomId, page = 0, size = 20) => {
  const response = await httpClient.get(`/api/v1/rooms/${roomId}/messages`, {
    params: {
      page,
      size,
    },
  });
  return response.data;
};
