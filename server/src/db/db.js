import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI =>", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("connected to MongoDB");
  } catch (err) {
    console.error("error to connect", err.message);
    process.exit(1);
  }
};

export default connectDB;
