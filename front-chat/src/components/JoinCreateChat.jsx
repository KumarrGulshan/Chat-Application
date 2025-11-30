import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createRoomApi, joinChatApi } from '../services/RoomServices';
import { useChatContext } from '../Context/ChatContext';
import { useNavigate } from 'react-router';

function JoinCreateChat() {
  const [detail, setDetail] = useState({
    roomId: "",
  });

  const { currentUser, setRoomId, setConnected, token } = useChatContext();
  const navigate = useNavigate();

  // Update currentUser from token on mount (handled in ChatContext)
  useEffect(() => {
    if (!token) {
      toast.error("Please login first!");
      navigate("/login");
    }
  }, [token, navigate]);

  // Handle Input
  function handleformInputChange(event) {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  }

  // Validation
  function ValidateForm() {
    if (detail.roomId === "") {
      toast.error("Room ID is required!");
      return false;
    }

    if (!token) {
      toast.error("Please login first!");
      return false;
    }

    return true;
  }

  // Join Room
  async function joinChat() {
    if (!ValidateForm()) return;

    try {
      const room = await joinChatApi(detail.roomId, token);
      toast.success("Joined room successfully!");
      setRoomId(room.roomId);
      setConnected(true);
      navigate('/chat');
    } catch (error) {
      toast.error(error.response?.data || "Error joining room");
      console.error("Join error:", error.response || error);
    }
  }

  // Create Room
  async function CreateRoom() {
    if (!ValidateForm()) return;

    try {
      const response = await createRoomApi(detail.roomId, token);
      toast.success("Room created successfully!");
      setRoomId(response.roomId);
      setConnected(true);
      navigate('/chat'); // Navigate first, user can join automatically in chat page
    } catch (error) {
      toast.error(error.response?.data || "Error creating room");
      console.error("Create error:", error.response || error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-10 dark:border-gray-700 border w-full max-w-md rounded shadow flex flex-col gap-5 dark:bg-gray-900">
        <h1 className="text-xl font-semibold text-center">Join Room / Create Room</h1>

        {/* Logged in user */}
        <div className="">
          <label className="block font-medium mb-2">Logged in as:</label>
          <div className="w-full px-4 py-2 dark:bg-gray-600 border dark:border-gray-600 rounded-lg text-white">
            {currentUser || "Not Logged In"}
          </div>
        </div>

        {/* Room ID Input */}
        <div className="">
          <label htmlFor="RoomId" className="block font-medium mb-2">Room ID / New Room ID</label>
          <input
            name="roomId"
            onChange={handleformInputChange}
            value={detail.roomId}
            placeholder="Enter Room ID"
            type="text"
            className="w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center gap-2 mt-2">
          <button onClick={joinChat} className="px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-lg">
            Join Room
          </button>
          <button onClick={CreateRoom} className="px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-lg">
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinCreateChat;
