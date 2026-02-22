import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("STREAM_API_KEY OR STREAM_API_SECRET is missing");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret); // This is for Chat Features
export const streamClient = new StreamClient(apiKey, apiSecret); // This is for Video Calls

export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);
    console.log("Stream User upserted succesfully:", userData);
  } catch (err) {
    console.error("Error Upserting Stream user :", err);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted succesfully", userId);
  } catch (err) {
    console.error("Error deleting Stream user :", err);
  }
};
