import mongoose from "mongoose";
import { ENV } from "./env.js";

const dropLegacyUserIndexes = async () => {
  const usersCollection = mongoose.connection.db.collection("users");
  const indexes = await usersCollection.indexes();

  if (!indexes.some((index) => index.name === "clerkId_1")) {
    return;
  }

  await usersCollection.dropIndex("clerkId_1");
  console.log("Removed legacy users index clerkId_1");
};

export const connectDB = async () => {
  try {
    if (!ENV.DB_URL) {
      throw new Error("DB_URL is not defined in enviornment variables");
    }

    const conn = await mongoose.connect(ENV.DB_URL);
    await dropLegacyUserIndexes();
    console.log("Connected to MongoDb", conn.connection.host);
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
};
