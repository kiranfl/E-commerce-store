import { useState } from "react";
import API from "./api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    alert("Logged in");
  };

  return (
    <div>
      <input onChange={e => setEmail(e.target.value)} placeholder="email" />
      <input onChange={e => setPassword(e.target.value)} placeholder="password" />
      <button onClick={login}>Login</button>
    </div>
  );
}