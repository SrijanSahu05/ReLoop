import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";

import connectDB from './database/db.js';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import messageRoute from './routes/messageRoute.js';
import socketHandler from './socket/socket.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

//call socket handler
socketHandler(io);

// Middleware setup
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
    origin: 'https://re-loop-two.vercel.app/',
    credentials: true
}))

app.get('/', (_, res) => {
    console.log("Hello from the backend! Server is running.");
    res.send("Hello from the backend! Server is running.");
});

app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/api/chat', messageRoute);

server.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});