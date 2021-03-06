const mongoose = require("mongoose");
const verifyJwt = require("./helpers/verifyJwt");

const User = require("../models/User");
const Room = require("../models/Room");
const Voter = require("../models/Voter");

const deleteRoom = async (req, res, decoded) => {
  User.findOne({ token: decoded.token })
    .then((doc) => doc)
    .then((doc) => {
      if (!doc)
        return res.status(403).json({ error: "Current user not found!" });
      Room.findOneAndDelete({ _id: doc.room, id: req.body.room })
        .then((room) => {
          if (!room) {
            return res
              .status(401)
              .json({ error: "You do not own this room or it doesn't exist!" });
          }
          doc.room = null;
          doc.save();
          Voter.deleteMany({
            _id: { $in: room.users.map((v) => mongoose.Types.ObjectId(v)) },
          })
            .then(() => {
              return res.status(200).json({ success: true });
            })
            .catch(() => {
              return res.status(500).json({ error: "Unable to delete Voter!" });
            });
        })
        .catch(() => res.status(500).json({ error: "Unable to delete!" }));
    })
    .catch(() => res.status(401).json({ error: "User not found!" }));
};

module.exports = verifyJwt(deleteRoom, 1);
