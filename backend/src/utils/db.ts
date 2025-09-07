import mongoose from "mongoose";

export async function connectDb() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("❌ MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // exit the process if db connection fails
  }
}
