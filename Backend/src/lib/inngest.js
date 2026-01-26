import { Inngest } from "inngest";
import connectDB  from "./db.js";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "interview-system" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      await connectDB();

      const { id, email_address, first_name, last_name, image_url } = event.data;

      console.log("Event data:", event.data);

      const newUser = {
        clerkId: id,
        email: email_address[0]?.email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        profileImage: image_url,
      };

      console.log("New user object:", newUser);

      await User.create(newUser);

      console.log("User created successfully:", newUser.clerkId);

      // Todo:do something else
    } catch (error) {
      console.error("Error in syncUser function:", error);
      throw error; // Re-throw to let Inngest handle it
    }
  },
);

const delUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;

    await User.deleteOne({ clerkId: id });

    // Todo:do something else
  },
);

export const functions = [syncUser, delUserFromDB];
