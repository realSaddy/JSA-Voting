const verifyJwt = require("./helpers/verifyJwt");

const User = require("../models/User");
const Room = require("../models/Room");

module.exports = async (req, res) => {
  decoded = verifyJwt(req.header("Authorization"), res);
  if (decoded === false) return;
  if (decoded.permission < 1) {
    return res.status(401).json({ error: "Not authorized" });
  }
  User.findOne({ token: decoded.token })
    .then((user) => user)
    .then((user) => {
      Room.findOne({ _id: user.room, owner: user._id })
        .populate("users")
        .then((room) => room)
        .then((room) => {
          let arr = [0, 0, 0];
          for (let i = 0; i < room.users.length; i++) {
            if (room.users[i].vote === "yea") arr[0]++;
            if (room.users[i].vote === "abstain") arr[1]++;
            if (room.users[i].vote === "nay") arr[2]++;
          }
          room.concluded = true;
          room.time = Date.now();
          room.yea = arr[0];
          room.nay = arr[1];
          room.abs = arr[2];
          room
            .save()
            .then(() => {
              User.updateOne({ token: decoded.token }, { room: null })
                .then(() => res.status(200).json({ success: true }))
                .catch(() =>
                  res.status(500).json({ error: "Unable to delete room" })
                );
            })
            .catch(() =>
              res.status(500).json({ error: "Unable to create concluded room" })
            );
        });
    });
};
