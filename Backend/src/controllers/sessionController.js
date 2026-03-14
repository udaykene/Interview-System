import { chatClient, streamClient, upsertStreamUser } from "../lib/stream.js";
import Session from "../models/Sessions.js";
import Problem from "../models/Problem.js";

export async function createSession(req, res) {
  try {
    const { problemId, problem, difficulty, visibility } = req.body;
    const userId = req.user._id;

    let problemTitle = problem;
    let problemDifficulty = difficulty;

    if (problemId) {
      const dbProblem = await Problem.findOne({ slug: problemId });
      if (!dbProblem) return res.status(404).json({ message: "Problem not found" });
      problemTitle = dbProblem.title;
      problemDifficulty = dbProblem.difficulty.toLowerCase();
    }

    if (!problemTitle || !problemDifficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }
    const sessionVisibility = visibility === "private" ? "private" : "public";

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const joinCode = await generateUniqueJoinCode();

    // Ensure host exists in Stream even if webhook sync was missed.
    await upsertStreamUser({
      id: userId.toString(),
      name: req.user.name,
      image: req.user.profileImage,
    });

    // create session in db
    const session = await Session.create({
      problem: problemTitle,
      problemId: problemId || null,
      difficulty: problemDifficulty,
      host: userId,
      callId,
      joinCode,
      visibility: sessionVisibility,
    });

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: userId.toString(),
        custom: {
          problem: problemTitle,
          difficulty: problemDifficulty,
          sessionId: session._id.toString(),
        },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problemTitle} Session`,
      created_by_id: userId.toString(),
      members: [userId.toString()],
    });

    await channel.create();

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(req, res) {
  try {
    const userId = req.user._id;
    const sessions = await Session.find({
      status: "active",
      $or: [{ visibility: "public" }, { host: userId }, { participant: userId }],
    })
      .populate("host", "name profileImage email")
      .populate("participant", "name profileImage email")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    const session = await Session.findById(id)
      .populate("host", "name email profileImage")
      .populate("participant", "name email profileImage");

    if (!session) return res.status(404).json({ message: "Session not found" });

    const isHost = session.host?._id?.toString() === userId;
    const isParticipant = session.participant?._id?.toString() === userId;
    const sessionData = session.toObject();
    if (session.visibility === "private" && !isHost && !isParticipant) {
      delete sessionData.joinCode;
    }

    res.status(200).json({ session: sessionData });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { code } = req.body;
    const normalizedCode = typeof code === "string" ? code.toUpperCase() : "";

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.visibility === "private" && session.joinCode !== normalizedCode) {
      return res.status(403).json({ message: "Invalid join code" });
    }

    if (session.status !== "active") {
      return res.status(400).json({ message: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({ message: "Host cannot join their own session as participant" });
    }

    // check if session is already full - has a participant
    if (session.participant) return res.status(409).json({ message: "Session is full" });

    const updated = await Session.findOneAndUpdate(
      { _id: id, participant: null, status: "active" },
      { participant: userId },
      { new: true },
    );
    if (!updated) return res.status(409).json({ message: "Session is full" });

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([userId.toString()]);

    res.status(200).json({ session: updated });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSessionByCode(req, res) {
  try {
    const { code } = req.body;
    const normalizedCode = typeof code === "string" ? code.toUpperCase() : "";
    if (!normalizedCode) return res.status(400).json({ message: "Join code is required" });

    const session = await Session.findOne({ joinCode: normalizedCode, status: "active" });
    if (!session) return res.status(404).json({ message: "Session not found" });

    req.params.id = session._id.toString();
    req.body.code = normalizedCode;
    return joinSession(req, res);
  } catch (error) {
    console.log("Error in joinSessionByCode controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function generateUniqueJoinCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let i = 0; i < 5; i += 1) {
    let code = "";
    for (let j = 0; j < 6; j += 1) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    const exists = await Session.findOne({ joinCode: code });
    if (!exists) return code;
  }
  return `S${Date.now().toString(36).slice(-5).toUpperCase()}`;
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // delete stream video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // delete stream chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
