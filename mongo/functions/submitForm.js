const verifyJwt = require("./helpers/verifyJwt");
const vote = require("../../middleware/socket").vote;

const Room = require("../models/Room");
const Voter = require("../models/Voter");

module.exports = async (req, res) => {
  decoded = verifyJwt(req.header("Authorization"), res);
  if (decoded === false) return;
  Voter.findOne({
    firstName: decoded.firstName,
    code: decoded.code,
    lastName: decoded.lastName,
    school: decoded.school,
  })
    .then((doc) => {
      if (doc.vote != null)
        return res.status(403).json({ error: "You've already voted!" });
      Room.findOne({ accessCode: doc.code }).then((room) => {
        if (!room) return res.status(409).json({ error: "Incorrect code!" });
        else if (!room.votingOpen)
          return res.status(455).json({
            error: "This room is not currently open for votes!",
          });
        doc.vote = req.body.vote;
        return doc
          .save()
          .then(() => res.status(202).json({ success: "Saved" }))
          .then(async () =>
            vote(
              [
                decoded.firstName,
                decoded.lastName,
                decoded.school,
                req.body.vote,
              ],
              await Room.findOne({ accessCode: decoded.code })
            )
          );
      });
    })
    .catch(() => {
      res.status(401).json({ error: "Voter not found!" });
    });
};
