import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './db/db.js'
import authroute from './routes/user.route.js'
import imageroute from './routes/image.routes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/auth",authroute)
app.use("/api/image",imageroute)
connectDB()
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
