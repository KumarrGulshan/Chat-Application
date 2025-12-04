import { useState } from "react";
import { loginApi } from "../services/AuthService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useChatContext } from "../Context/ChatContext"; // ✅ import ChatContext

function Login() {
  const { setToken } = useChatContext(); // ✅ get setToken from context
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
  if (!username || !password) return toast.error("Enter username and password");
  try {
    const token = await loginApi(username, password);
    setToken(token);  // ✅ sets token in context
    localStorage.setItem("token", token); // ✅ MUST store in localStorage
    toast.success("Login successful");
    navigate("/room");
  } catch (e) {
    toast.error(e?.response?.data || "Invalid credentials");
  }
};
  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Login</h2>
      <input
        className="w-full px-4 py-2 dark:bg-gray-600 border dark:border-gray-600 rounded-lg text-white mb-2"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full px-4 py-2 dark:bg-gray-600 border dark:border-gray-600 rounded-lg text-white mb-2"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-lg"
        onClick={login}
      >
        Login
      </button>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-600 cursor-pointer"
        >
          Register
        </span>
      </p>
    </div>
  );
}

export default Login;
