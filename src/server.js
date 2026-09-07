import "dotenv/config";
import app from "./app.js"
import http from "http"
import { Server } from "socket.io"
import { connectDb } from "./config/db.js"
import { verifyEmailConnection } from "./services/email.service.js";
import { socketAuthMiddleware } from "./middlewares/socket.middleware.js";


const PORT = process.env.PORT || 5000 

await connectDb()

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin:"*"
  }
})
io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  console.log(`socket connected!! :${socket.id}`)
  console.log("SOCKET USER:", socket.userId);

  socket.on("join-meeting", ({ roomId })=> {
    socket.join(roomId)

    console.log(`User ${socket.userId} joined the meeting ${roomId}`)

    socket.to(roomId).emit("user-joined", {
      userId: socket.userId,
      socketId:socket.id
    })
  }
    )

  socket.on("leave-meeting", ({ roomId }) => {
    socket.leave(roomId)

    console.log(`User ${socket.userId} left meeting ${roomId}`);
    
        socket.to(roomId).emit("user-left", {
          userId: socket.userId,
        });
  })

  socket.on("webrtc-offer", ({ offer,targetSocketId }) => {
    console.log("Received WebRTC offer from:", socket.id);
    console.log("Sending offer to:", targetSocketId);
    
  
    io.to(targetSocketId).emit("webrtc-offer", {
      offer,
      fromSocketId:socket.id
    });

  });
    socket.on("webrtc-answer", ({ answer,targetSocketId }) => {
      console.log("Received answer from:", socket.id);
       console.log("Sending answer to:", targetSocketId);
   
       io.to(targetSocketId).emit("webrtc-answer", {
           answer,
       });
    })

  socket.on("webrtc-ice-candidate", ({ candidate,targetSocketId }) => {
    console.log("Received ICE candidate:", candidate);
  
    io.to(targetSocketId).emit("webrtc-ice-candidate", {
      candidate
    });
  });
  
  
  socket.on("disconnect", () => {
    console.log(`socket disconnected!! :${socket.id}`)
  })
})

await verifyEmailConnection();

httpServer.listen(PORT, () => {
  console.log(`Zoom is listening on PORT:${PORT}`)
})