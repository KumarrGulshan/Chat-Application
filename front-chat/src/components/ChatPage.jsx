import  { useEffect, useRef, useState } from 'react'
import { MdAttachFile, MdSend } from 'react-icons/md'
import { useNavigate } from 'react-router';
import {useChatContext} from '../Context/ChatContext.jsx'
import SockJS from 'sockjs-client';
import {baseURL} from '../config/AxiosHelper.js'
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { getMessages } from '../services/RoomServices.js';
import { timeAgo } from '../config/helper.js';





function ChatPage() {

    const {roomId, currentUser, connected,setConnected,setRoomId, setCurrentUser} = useChatContext();
    // console.log(roomId);
    // console.log(currentUser);
    // console.log(connected);

    const navigate = useNavigate();
    useEffect(() => {
        if(!connected){
            navigate("/");
        }
    },[connected, roomId, currentUser,]);



    const [messages,setMessages] = useState([ ]);
    const [input , setInput] = useState("");
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);

   useEffect(() => {
    async function loadMessages() {
        try {
            const messages = await getMessages(roomId, 0, 20);
            setMessages(messages);
        } catch (error) {
            console.error("Failed to load messages:", error);
            toast.error("Failed to load messages");
        }
    }

    if (connected){ 
        loadMessages();

    }
}, [roomId]);

  useEffect(() => {
    if (chatBoxRef.current) {
        chatBoxRef.current.scroll({
            top: chatBoxRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
}, [messages]);


    useEffect(()=>{

        const connectWebSocket = ()=>{
          
            const sock = new SockJS(`${baseURL}/chat`);
            const client = Stomp.over(sock);
            client.connect({},()=>{

                setStompClient(client);
                toast.success("connected");
                client.subscribe(`/topic/room/${roomId}`,(messages)=>{
                    console.log(messages);
                    const newMessage = JSON.parse(messages.body);
                    setMessages((prev)=> [...prev,newMessage]);
                });
            });

        };
        if(connected){
        connectWebSocket();
        }

    },[roomId]);

    const sendMessage = async () => {
    if (stompClient && connected && input.trim()) {
        console.log(input);
        const message = {
            sender: currentUser,
            content: input,
            roomId: roomId
        };
       stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
        setInput("");
    }
};

 function handlelogout() {
    
        stompClient.disconnect()
            setConnected(false);
            setRoomId("");
            setCurrentUser("");
            navigate("/");
    }
  
   
  return (
    <div>
        <header className='dark:bg-gray-800 py-5 dark:text-gray-200 bg-gray-100 text-gray-900 p-5 flex justify-between items-center shadow'>
            <div>
                <h1 className='text-xl font-semibold'>Room : <span>{roomId}</span></h1>
            </div>
            <div>
                <h1 className='text-xl font-semibold'>User : <span>{currentUser}</span></h1>
            </div>
            <div>
                <button onClick={handlelogout} className='dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-lg'>Leave Room</button>
            </div>
        </header>

        <main ref={chatBoxRef} className=' w-full pb-20 px-10 dark:bg-slate-700 mx-auto h-screen overflow-auto'>
          {
            messages.map((message, index) =>(
                <div key={index} 
                className={`flex ${message.sender === currentUser ? "justify-end" : "justify-start"}`}>
                 <div className={`my-2 ${message.sender === currentUser ? "bg-green-950" : "bg-gray-800"} p-1 max-w-xs rounded-xl`}>


                  
                <div className='flex flex-row gap-2'>
                    <img className='h-10 w-10' src="https://avatar.iran.liara.run/public/15" alt="" />
                     <div className=' flex flex-col gap-1'>
                    <p className='text-sm font-bold'>{message.sender}</p>
                    <p>{message.content}</p>
                    <p className='text-xs text-gray-400'>{timeAgo(message.timestamp)}</p>
                 </div>
                </div>
                </div>
                </div>
                
            ))
          }
        </main>

        <div className='fixed bottom-4 w-full h-16'>
            <div className='h-full pr-10 gap-4 rounded-full w-1/2 flex items-center justify-between mx-auto dark:bg-gray-900'>
            <input 
            onKeyDown={(e)=>{
               if(e.key === "Enter") {
                sendMessage();
               }

            }}
            type="text"
            value={input}
            onChange={(e) =>{ setInput(e.target.value)}}
             placeholder='Type your message here..' className=' dark:bg-gray-900 px-5 py-2 w-full rounded-full h-full focus:outline-none' />
            <div className='flex gap-4'>
                <button className='dark:bg-purple-600  rounded-lg h-10 w-10 flex justify-center items-center'><MdAttachFile size={20}/>
            </button>
            <button 
            onClick={sendMessage} className='dark:bg-green-600  rounded-lg h-10 w-10 flex justify-center items-center'><MdSend size={20}/>
            </button>
            </div>
            </div>
        </div>
    </div>
  )
}


export default ChatPage