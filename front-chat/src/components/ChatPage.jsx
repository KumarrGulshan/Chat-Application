import React, { useRef, useState } from 'react'
import { MdAttachFile, MdSend } from 'react-icons/md'






function ChatPage() {
    const [messages,setMessages] = useState([
        {
            content:"Hello ?",
            sender: "Gulshan",
        },
          {
            content:"Hello ?",
            sender: "Mayan",
        },
          {
            content:"Hello ?",
            sender: "Parmanand",
        },
          {
            content:"Hello ?",
            sender: "Gulshan",
        },
          {
            content:"Hello ?",
            sender: "Gulshan",
        },
          {
            content:"Hello ?",
            sender: "Gulshan",
        },
          {
            content:"Hello ?",
            sender: "Gulshan",
        },
          {
            content:"Hello ?",
            sender: "Gulshan",
        },
          {
            content:"Hello ?",
            sender: "Gulshan",
        },
          {
            content:"Hello ?",
            sender: "agnau",
        },
          {
            content:"Hello ?",
            sender: "Gulshan",
        },
          {
            content:"Hello ?",
            sender: "aigjau",
        },
          {
            content:"Hello ?",
            sender: "Gulshan",
        },
          {
            content:"Hello ?",
            sender: "fdihguae",
        },
          {
            content:"Hello, How are you ?",
            sender: "Gulshan",
        },
          {
            content:"Hello ?",
            sender: "djiajrg",
        },
          {
            content:"Hello ?",
            sender: "Gulshan",
        },
          {
            content:"Hello ?",
            sender: "ohguahg",
        },
          {
            content:"Hello ?",
            sender: "Gulshan",
        },
    ]);
    const [input , setInput] = useState("");
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);
    const [ roomId , setRoomId] = useState("");
    const [currentUser] = useState("Gulshan");
  return (
    <div>
        <header className='dark:bg-gray-800 py-5 dark:text-gray-200 bg-gray-100 text-gray-900 p-5 flex justify-between items-center shadow'>
            <div>
                <h1 className='text-xl font-semibold'>Room : <span>Family Room</span></h1>
            </div>
            <div>
                <h1 className='text-xl font-semibold'>User : <span>Gulshan kumar</span></h1>
            </div>
            <div>
                <button className='dark:bg-red-500 dark:hover:bg-red-700 px-3 py-2 rounded-lg'>Leave Room</button>
            </div>
        </header>

        <main className=' w-full pb-20 px-10 dark:bg-slate-700 mx-auto h-screen overflow-auto'>
          {
            messages.map((message, index) =>(
                <div key={index} 
                className={`flex ${message.sender === currentUser ? "justify-end" : "justify-start"}`}>
                 <div className={`my-2 ${message.sender === currentUser ? "bg-green-950" : "bg-gray-800"} p-2 max-w-xs rounded`}>


                  
                <div className='flex flex-row gap-2'>
                    <img className='h-10 w-10' src="https://avatar.iran.liara.run/public/15" alt="" />
                     <div className=' flex flex-col gap-1'>
                    <p className='text-sm font-bold'>{message.sender}</p>
                    <p>{message.content}</p>
                 </div>
                </div>
                </div>
                </div>
                
            ))
          }
        </main>

        <div className='fixed bottom-4 w-full h-16'>
            <div className='h-full pr-10 gap-4 rounded-full w-1/2 flex items-center justify-between mx-auto dark:bg-gray-900'>
            <input type="text" placeholder='Type your message here..' className=' dark:bg-gray-900 px-5 py-2 w-full rounded-full h-full focus:outline-none' />
            <div className='flex gap-4'>
                <button className='dark:bg-purple-600  rounded-lg h-10 w-10 flex justify-center items-center'><MdAttachFile size={20}/>
            </button>
            <button className='dark:bg-green-600  rounded-lg h-10 w-10 flex justify-center items-center'><MdSend size={20}/>
            </button>
            </div>
            </div>
        </div>
    </div>
  )
}

export default ChatPage