import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import AppRoutes from './config/Routes.jsx'
import { Toaster } from 'react-hot-toast'
import { ChatProvider } from './Context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
    <ChatProvider>
      <AppRoutes/>
    </ChatProvider>
    <Toaster position='top-right'/>
    </BrowserRouter> 

)
