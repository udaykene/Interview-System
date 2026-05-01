import User from "../models/User.js";

export const normalizeDisplayName = (value) =>
  value
    ?.trim()
    .replace(/\s+/g, " ")
    .slice(0, 60) || "";

export const deriveNameFromEmail = (email = "") => {
  const prefix = email.split("@")[0] || "";
  const cleaned = prefix
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "User";

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const resolveDisplayName = ({ name, username, email }) =>
  normalizeDisplayName(name) ||
  normalizeDisplayName(username) ||
  deriveNameFromEmail(email);

export const generateUsername = async (base) => {
  const seed = (base || "user").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15) || "user";
  let username = seed;
  let counter = 0;

  while (await User.findOne({ username })) {
    counter++;
    username = `${seed}${Math.floor(1000 + Math.random() * 9000)}`;
    if (counter > 10) username = `user${Date.now().toString(36)}`;
  }

  return username;
};
