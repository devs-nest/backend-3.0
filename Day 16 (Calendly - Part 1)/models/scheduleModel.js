const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const scheduleSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: "User",
  },
  day: {
    type: Date,
    required: true,
  },
  dayStart: {
    type: Date,
    required: true,
  },
  dayEnd: {
    type: Date,
    required: true,
  },
  eventDuration: {
    type: Number,
    required: true,
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

module.exports = mongoose.model("Schedule", scheduleSchema);
