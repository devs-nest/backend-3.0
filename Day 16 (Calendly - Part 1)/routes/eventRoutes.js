const express = require("express");
const Event = require("../models/eventModel");
const isAuthenticated = require("../middlewares/auth");
const { validateEmail } = require("../utils/validators");
const router = express.Router();

// @route   POST api/v1/event/create
// @desc    Create event
// @access  Public

router.post("/create", async (req, res) => {
  try {
    const {
      menteeEmail,
      mentorID,
      schedule,
      title,
      description,
      day,
      start,
      end,
    } = req.body;

    if (!validateEmail(menteeEmail)) {
      return res.status(400).json({ err: "Error: Invalid email" });
    }

    const foundUser = await User.findById(mentorID);

    if (!foundUser) {
      return res.status(404).json({ err: "User not found" });
    }

    const foundSchedule = await Schedule.findById(schedule);

    if (!foundSchedule) {
      return res.status(404).json({ err: "Schedule not found" });
    }

    if (start < foundSchedule.dayStart || end > foundSchedule.dayEnd) {
      return res.status(400).json({
        err: "Error: Event start and end times must be within schedule",
      });
    }

    const foundClashingMenteeEvent = await Event.findOne({
      menteeEmail,
      day,
      start: { $lte: end },
      end: { $gte: start },
    });

    if (foundClashingMenteeEvent) {
      return res.status(400).json({
        err: "Error: Event clashes with another event",
      });
    }

    const foundClashingMentorEvent = await Event.findOne({
      mentorID,
      day,
      start: { $lte: end },
      end: { $gte: start },
    });

    if (foundClashingMentorEvent) {
      return res.status(400).json({
        err: "Error: Event clashes with another event",
      });
    }

    const newEvent = new Event({
      menteeEmail,
      mentorID,
      schedule,
      title,
      description,
      day,
      start,
      end,
    });

    await newEvent.save();
    foundUser.events.push(newEvent);
    await foundUser.save();
    foundSchedule.events.push(newEvent);
    await foundSchedule.save();

    res.status(201).json(newEvent);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

// @route   GET api/v1/event/get/:eventID
// @desc    Get event by event ID
// @access  Public

router.get("/get/:eventID", async (req, res) => {
  try {
    const foundEvent = await Event.findById(req.params.eventID);
    if (!foundEvent) {
      return res.status(404).json({ err: "Event not found" });
    }

    res.status(200).json(foundEvent);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

// @route   GET api/v1/event/delete/:eventID
// @desc    Delete event by event ID
// @access  Public

router.get("/delete/:eventID", async (req, res) => {
  try {
    const foundEvent = await Event.findById(req.params.eventID);
    if (!foundEvent) {
      return res.status(404).json({ err: "Event not found" });
    }

    const foundUser = await User.findById(foundEvent.menteeEmail);
    if (!foundUser) {
      return res.status(404).json({ err: "User not found" });
    }

    const foundSchedule = await Schedule.findById(foundEvent.schedule);

    if (!foundSchedule) {
      return res.status(404).json({ err: "Schedule not found" });
    }

    await foundUser.events.pull(foundEvent);
    await foundUser.save();
    await foundSchedule.events.pull(foundEvent);
    await foundSchedule.save();
    await foundEvent.delete();
    res.status(200).json({ msg: "Event deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

module.exports = router;
