const verifyRoomsOpen = require("./helpers/verifyRoomsOpen");
const checkRoomsOpen = require("./helpers/checkRoomsOpen");

const Room = require("../models/Room");

const page = async (req, res) => {
  Room.find(
    { concluded: true },
    {
      _id: 0,
      id: 1,
      yea: 1,
      nay: 1,
      abs: 1,
      bestSpeaker: 1,
      byline: 1,
      time: 1,
    }
  )
    .sort({ _id: -1 })
    .limit(10)
    .skip(req.params.page * 10)
    .then((arr) => {
      return res.status(200).json({ res: arr, success: true });
    })
    .catch(() => {
      return res.status(500).json({ error: "Failure getting page" });
    });
};

module.exports = checkRoomsOpen(verifyRoomsOpen(page));
