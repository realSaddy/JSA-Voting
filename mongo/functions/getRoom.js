const verifyJwt = require("./helpers/verifyJwt");

const User = require("../models/User");
const Room = require("../models/Room");

module.exports = async (req, res) => {
  decoded = verifyJwt(req.header("Authorization"), res);
  if (decoded === false) return;
  if (decoded.permissions.indexOf("Mod") === -1) {
    return res.status(401).json({ error: "Not authorized" });
  }
  return User.findOne({ token: decoded.token })
    .then((doc) => doc)
    .then((doc) => {
      if (!doc)
        return res.status(403).json({ error: "Current user not found!" });
      return Room.findOne({ concluded: false, owner: doc._id })
        .populate("users")
        .then((room) => room)
        .then((room) => {
          if (!room) return res.status(404).json({ error: "No current room!" });
          return res.status(200).send({
            id: room.id,
            users: room.users,
            accessCode: room.accessCode,
            open: room.open,
            votingOpen: room.votingOpen,
          });
        });
    });
};
