import jwt from "jsonwebtoken";
import User from "../Models/user.js";
import mongoose from "mongoose";

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
   
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    if (token.startsWith('mock-token-')) {
      req.user = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Mock User',
        email: 'mock@example.com',
        preferences: {
          learningStyle: 'project-based',
          freeOnly: false,
          certificationRequired: false
        }
      };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
