import { useState } from "react";
import { registerApi } from "../services/AuthService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    if (!username || !password) return toast.error("Enter username and password");
    try {
      await registerApi(username, password);
      toast.success("Registered — please log in");
      navigate("/login");
    } catch (e) {
      toast.error(e?.response?.data || "Registration failed");
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Register</h2>
      <input className="w-full p-2 mb-2 border" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input className="w-full p-2 mb-2 border" placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full p-2 bg-green-600 text-white" onClick={register}>Register</button>
    </div>
  );
}

export default Register;
