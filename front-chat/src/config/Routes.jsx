import React from 'react'
import { Route, Routes } from 'react-router'
import App from '../App';
import ChatPage from '../components/ChatPage';

function AppRoutes() {
  return (
    <Routes>
    <Route path="/" element={<App/>}/>
    <Route path="/chat" element={<ChatPage/>}/>
     <Route path="*" element={<h1>404 Page not Found</h1>}/>
    </Routes>
  );
    
};

export default AppRoutes;