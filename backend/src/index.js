import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import http from "http"; // Import the http module

dotenv.config();
const app = express();

// Create an HTTP server and pass it to Socket.IO
const server = http.createServer(app);
const io = new Server(server); // Initialize io with the server

// Export the server and io so other modules can use it
export { io, server };  // Export io and server

const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log('Server is running on port : ' + PORT);
  connectDB();
});
