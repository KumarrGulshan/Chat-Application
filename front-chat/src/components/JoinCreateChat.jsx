import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { createRoomApi, joinChatApi } from '../services/RoomServices';
import { useChatContext } from '../Context/ChatContext';
import { useNavigate } from 'react-router';

function JoinCreateChat() {
  
const [detail,setdetail] = useState({
  roomId: "",
  userName:"",
});

const {roomId, userName, setRoomId, setCurrentUser,setConnected } = useChatContext();
const navigate = useNavigate()

function handleformInputChange(event)
{ 
  setdetail({
    ...detail,
    [event.target.name]: event.target.value,
  });
}

function ValidateForm(){
  if(detail.roomId === "" || detail.userName === ""){
    toast.error("Invalid Input !!")
    return false;
  }
  return true;
}


 async function jointChat(){
  if(ValidateForm()){
    console.log("valid");
    // join the room
    try{
      const room = await joinChatApi(detail.roomId);
      toast.success("joined...");
      setCurrentUser(detail.userName);
      setRoomId(room.roomId);
      console.log(roomId);
      setConnected(true);
      navigate('/chat');
    }
    catch(error){
      if(error.status == 400){
        toast.error(error.response.data);
      }
      else{
      toast.error('Error in joining room');
      }
       console.log("error");
    }
  }

 }

 async function CreateRoom(){
  if (ValidateForm()){
    // create room
    console.log("detail");
    try{
      const response = await createRoomApi(detail.roomId)
      console.log(response);
      toast.success("Room Created Successfully !!");
      setCurrentUser(detail.userName);
      setRoomId(response.roomId);
      setConnected(true);
      navigate("/chat");

      jointChat();
    }
    catch(error){
      console.log(error);
    if(error.status==400)
    {
      toast.error("Room already exists !!")
    }
    else{
       toast("Error in creating room");
    }
     
    }
  }

 }

  return (
    <div className="min-h-screen flex items-center justify-center ">
        <div className=' p-10 dark:border-gray-700 border w-full max-w-md rounded shadow flex flex-col gap-5 dark:bg-gray-900'>
            <h1 className=' text-xl font-semibold text-center'>Join Room / Create Room...</h1>

            <div className=''>
                 <label htmlFor="name" className='block font-medium mb-2 '>Your Name</label> 
            <input 
            onChange={handleformInputChange}
            value={detail.userName}
            type="text"
            id='name'
            name='userName'
            placeholder='Enter Your Name'
            className='w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
            </div>

            <div className=''>
                 <label htmlFor="RoomId" className='block font-medium mb-2'>Room ID/ New Room ID</label> 
            <input 
            name='roomId'
            onChange={handleformInputChange}
            value={detail.roomId}
            placeholder='Enter Room Id'
            type="text"
            id='name'
            className='w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
            </div>

            <div className='flex justify-center gap-2 mt-2'>
                <button onClick={jointChat} className='px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-lg'>Join Room</button>
                <button onClick={CreateRoom} className='px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-lg'>Create Room</button>
            </div>
        </div>
    </div>
  )
}

export default JoinCreateChat