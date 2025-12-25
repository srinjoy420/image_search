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
// Support multiple origins for Vercel preview deployments
const allowedOrigins = [];
const clientUrl = process.env.API_URL || "http://localhost:5173";

if (clientUrl) {
  // Support comma-separated URLs or single URL
  const urls = clientUrl.split(',').map(url => url.trim());
  urls.forEach(url => {
    const origin = url.startsWith('http') ? url : `https://${url}`;
    allowedOrigins.push(origin);
  });
}
// Always allow localhost for development
allowedOrigins.push('http://localhost:5173');

// Function to check if origin is allowed
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  exposedHeaders: ["Set-Cookie"],
};

console.log('🌐 CORS Allowed Origins:', allowedOrigins);
console.log('🌐 Environment API_URL:', process.env.API_URL);

app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/auth", authroute)
app.use("/api/image", imageroute)
connectDB()
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
