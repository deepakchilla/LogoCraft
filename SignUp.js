import { useState } from "react";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        email,
        password,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Signup</h1>
      <input className="border p-2 mb-4" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input className="border p-2 mb-4" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="border p-2 mb-4" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={registerUser} className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
    </div>
  );
}

export default Signup;
