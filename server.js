require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const https = require("https");
const io = require("socket.io")();
const cookieParser = require("cookie-parser");

const app = express();
const {
  authenticateCode,
  addSpeaker,
  clearRooms,
  concludeRoom,
  createRoom,
  createUser,
  deleteRoom,
  deleteUser,
  getRoom,
  getSpeakers,
  getTotalPages,
  login,
  page,
  removeSpeaker,
  roomsOpen,
  roomsToggle,
  speakerVote,
  submitForm,
  toggleOpen,
  toggleVoting,
  updateRoomByline,
} = require("./mongo");
const privateKey = fs.readFileSync("server.key", "utf8");
const certificate = fs.readFileSync("server.crt", "utf8");

io.origins("*:*");
app.use(cookieParser());
require("./middleware/socket").setup(io);
app.use(bodyParser.json());

app.get("/api/get_speakers", getSpeakers);
app.get("/api/page/:page", page);
app.get("/api/rooms_open", roomsOpen);
app.get("/api/total_pages", getTotalPages);

app.post("/api/add_speaker", addSpeaker);
app.post("/api/auth_code", authenticateCode);
app.post("/api/create_room", createRoom);
app.post("/api/create_user", createUser);
app.post("/api/get_room", getRoom);
app.post("/api/login", login);
app.post("/api/speaker_vote", speakerVote);
app.post("/api/submit_form", submitForm);
app.post("/api/toggle_open", toggleOpen);
app.post("/api/toggle_voting", toggleVoting);

app.patch("/api/conclude_room", concludeRoom);
app.patch("/api/room_byline", updateRoomByline);
app.patch("/api/rooms_toggle", roomsToggle);

app.delete("/api/clear_rooms", clearRooms);
app.delete("/api/delete_user", deleteUser);
app.delete("/api/remove_speaker", removeSpeaker);
app.delete("/api/room", deleteRoom);

if (process.env.DEPLOY === "true") {
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });

  const httpsServer = https.createServer(
    { key: privateKey, cert: certificate },
    app
  );
  httpsServer.listen(443, () => console.log("✓ Production: 443"));
  const ioserver = https.createServer(
    { key: privateKey, cert: certificate },
    app
  );
  ioserver.listen(8443);
  io.listen(ioserver);
  console.log("\x1b[32m✓\x1b[0m Socket.io listening on port 8443");
} else {
  app.listen(443, () =>
    console.log("\x1b[32m✓\x1b[0m Running on port 443 in dev mode")
  );
  io.listen(8000);
  console.log("\x1b[32m✓\x1b[0m Socket.io listening on port 8000");
}
