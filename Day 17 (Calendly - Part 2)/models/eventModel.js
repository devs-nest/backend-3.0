const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const eventSchema = new mongoose.Schema({
  menteeEmail: {
    type: String,
    required: true,
  },
  mentorID: {
    type: ObjectId,
    ref: "User",
  },
  schedule: {
    type: ObjectId,
    ref: "Schedule",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  day: {
    type: Date,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Event", eventSchema);
