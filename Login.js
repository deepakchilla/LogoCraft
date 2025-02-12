import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const loginUser = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      setMessage(response.data.message);
      localStorage.setItem("token", response.data.token); // Save the JWT token

      window.location.href = "/"; // Redirect to homepage after login
    } catch (error) {
      setMessage("Invalid credentials. Please try again.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <input
          className="border p-2 mb-4 w-full"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2 mb-4 w-full"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={loginUser}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
        >
          Login
        </button>
        <p className="text-red-500 mt-4">{message}</p>
      </div>
    </div>
  );
}

export default Login;
