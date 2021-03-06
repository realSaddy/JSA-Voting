const verifyJwt = require("./helpers/verifyJwt");

const User = require("../models/User");
const Room = require("../models/Room");
const Voter = require("../models/Voter");

const deleteUser = async (req, res, decoded) => {
  User.findOne({ token: decoded.token })
    .then((user) => user)
    .then((user) => {
      Room.findOne({ _id: user.room, concluded: false, owner: user._id })
        .then((room) => room)
        .then((room) => {
          Voter.findOneAndDelete({
            firstName: req.body.first,
            lastName: req.body.last,
            school: req.body.school,
            code: room.accessCode,
          }).then((doc) => {
            if (doc == null) {
              return res.status(404).json({ error: "Voter was not found!" });
            }
            return res.status(200).json({ success: true });
          });
        });
    });
};

module.exports = verifyJwt(deleteUser, 1);
