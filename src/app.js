import cors from "cors"
import cookieParser from "cookie-parser"
import express from "express"
import errorMiddleware from "./middlewares/error.middleware.js"

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(errorMiddleware);

app.get("/api/health", (req, res) => {
  console.log("Health route hit");
  res.status(200).json({
    success: true,
    message:"Server is running "
  })
})

// import routes
import authRoutes from "./routes/auth.route.js"
import meetingRoutes from "./routes/meeting.route.js";
app.use("/api/auth",authRoutes)
app.use("/api/meetings", meetingRoutes);

export default app
