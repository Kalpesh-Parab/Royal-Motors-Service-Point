import { useState } from "react";
import "./adminLogin.scss";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminLogin({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      onSuccess(res.data.token);
      toast.success("Welcome Admin");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <form className="admin-login" onSubmit={handleLogin}>
      <h2>Admin Access</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Login</button>
    </form>
  );
}
