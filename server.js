require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://username:password@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority";
const JWT_SECRET = process.env.JWT_SECRET;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "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";

// Middleware
app.use(express.json());
app.use(cors());

// 🔹 Connect to MongoDB (Fixing the Error)
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Avoid hanging connections
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });

// 🔹 User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

// -------------------------------------------
// 🔹 API ROUTES
// -------------------------------------------

// ✅ User Signup
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error });
  }
});

// ✅ User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});

// ✅ Generate AI Logo using OpenAI's DALL·E API
app.post("/generate-logo", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ image_url: response.data.data[0].url });
  } catch (error) {
    console.error("❌ Error generating logo:", error);
    res.status(500).json({ message: "Failed to generate logo" });
  }
});

// ✅ Protected Route (Example: Dashboard)
app.get("/dashboard", (req, res) => {
  res.json({ message: "Welcome to the Dashboard! (Protected Route)" });
});

// -------------------------------------------
// 🔹 Start the Server
// -------------------------------------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
