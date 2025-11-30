import { Route, Routes, Navigate } from 'react-router'
import Login from "../components/Login";
import Register from "../components/Register";
import ChatPage from '../components/ChatPage';
import JoinCreateChat from '../components/JoinCreateChat';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* After login, user goes here */}
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/room" element={<JoinCreateChat />} />

      {/* Default: redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
