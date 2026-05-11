import mongoose from "mongoose";
import { ENV } from "./env.js";
import User from "../models/User.js";

const dropLegacyUserIndexes = async () => {
  const usersCollection = mongoose.connection.db.collection("users");
  const indexes = await usersCollection.indexes();

  if (indexes.some((index) => index.name === "clerkId_1")) {
    await usersCollection.dropIndex("clerkId_1");
    console.log("Removed legacy users index clerkId_1");
  }

  const providerIdIndex = indexes.find((index) => index.name === "providerId_1");
  const hasExpectedPartialIndex =
    providerIdIndex?.unique === true &&
    providerIdIndex?.partialFilterExpression?.providerId?.$type === "string";

  if (providerIdIndex && !hasExpectedPartialIndex) {
    await usersCollection.dropIndex("providerId_1");
    console.log("Replaced users index providerId_1 with partial unique index");
  }
};

export const connectDB = async () => {
  try {
    if (!ENV.DB_URL) {
      throw new Error("DB_URL is not defined in enviornment variables");
    }

    const conn = await mongoose.connect(ENV.DB_URL);
    await dropLegacyUserIndexes();
    await User.syncIndexes();
    console.log("Connected to MongoDb", conn.connection.host);
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
};
