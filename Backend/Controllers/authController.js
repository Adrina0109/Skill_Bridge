import User from "../models/user.js";
import jwt from "jsonwebtoken";
import sendWelcomeEmail from "../utils/email.js";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Set JWT in HTTP-only cookie
const sendTokenAsCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true, // not accessible via JS
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "none", // protects against CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, preferences } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, preferences });

    // Send welcome email (optional)
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (e) {
      console.warn("Welcome email failed:", e.message);
    }

    // Generate token and set cookie
    const token = generateToken(user._id);
    sendTokenAsCookie(res, token);

    // Also include token in response body (so frontend can store it in localStorage if desired)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate token and set cookie
    const token = generateToken(user._id);
    sendTokenAsCookie(res, token);

    // Also include token in response body (so frontend can store it in localStorage if desired)
    res.json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Optional: Logout user by clearing cookie
export const logoutUser = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: "Logged out successfully" });
};
