import { chatClient, upsertStreamUser } from "../lib/stream.js"; // this is the stream client

// this is the route for getting the stream token
export async function getStreamToken(req, res) {

  try {
    // use mongodb user id for Stream
    const streamId = req.user._id.toString();
    await upsertStreamUser({
      id: streamId,
      name: req.user.name,
      image: req.user.profileImage,
    });
    const token = chatClient.createToken(streamId);

    res
      .status(200)
      .json({
        token,
        userId: streamId,
        userName: req.user.name,
        userImage: req.user.profileImage,
      });
  } catch (error) {
    console.log("Error in getStreamToken controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
