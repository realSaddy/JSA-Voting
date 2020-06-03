const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voter",
    },
  ],
  accessCode: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  open: { type: Boolean, default: true },
});

module.exports.Room = mongoose.model("Room", roomSchema);
