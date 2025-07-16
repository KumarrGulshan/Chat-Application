import React from 'react'

function JoinCreateChat() {
  return (
    <div className="min-h-screen flex items-center justify-center ">
        <div className=' p-10 dark:border-gray-700 border w-full max-w-md rounded shadow flex flex-col gap-5 dark:bg-gray-900'>
            <h1 className=' text-xl font-semibold text-center'>Join Room / Create Room...</h1>

            <div className=''>
                 <label htmlFor="name" className='block font-medium mb-2 '>Your Name</label> 
            <input 
            type="text"
            id='name'
            className='w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
            </div>

            <div className=''>
                 <label htmlFor="RoomId" className='block font-medium mb-2'>Room ID/ New Room ID</label> 
            <input 
            type="text"
            id='name'
            className='w-full dark:bg-gray-600 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' />
            </div>

            <div className='flex justify-center gap-2 mt-2'>
                <button className='px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-lg'>Join Room</button>
                <button className='px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-lg'>Create Room</button>
            </div>
        </div>
    </div>
  )
}

export default JoinCreateChat