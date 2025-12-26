import express from 'express'
import dotenv from 'dotenv'
import cors from "cors"
import cookieParser from 'cookie-parser'
import connectDB from './db/db.js'
import authroute from './routes/user.route.js'
import imageroute from './routes/image.routes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
app.use(cookieParser())
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// CORS configuration - API_URL should be your frontend URL (where requests come from)
app.use(cors({
  origin:"https://image-search-mu-peach.vercel.app",
  credentials:true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  exposedHeaders: ["Set-Cookie"],

}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/auth", authroute)
app.use("/api/image", imageroute)
connectDB()
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
