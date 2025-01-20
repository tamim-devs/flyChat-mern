import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from '../index.js';  // Correct import from index.js

// Sidebar Users
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Messages
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // Fixed the typo here
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, reciverId: userToChatId },
        { senderId: userToChatId, reciverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Send Message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: reciverId } = req.params;
    const senderId = req.user._id;

    if (!text.trim() && !image) {
      return res.status(400).json({ message: "Message content is required" });
    }

    let imageUrl;
    if (image) {
      try {
        const timestamp = Math.floor(new Date().getTime() / 1000)
        const uploadResponse = await cloudinary.uploader.upload(image ,{
          timestamp: timestamp,
        }) ;
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError.message);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    const newMessage = new Message({
      senderId,
      reciverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    // Emit real-time message to the recipient (Socket.io)
    io.to(reciverId).emit('newMessage', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};