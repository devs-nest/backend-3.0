const express = require("express");
const User = require("../models/userModel");
const Schedule = require("../models/scheduleModel");
const Event = require("../models/eventModel");
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

    // Check if event duration matches schedule event duration
    let date1 = new Date("1970-01-01T" + start + "Z");
    let date2 = new Date("1970-01-01T" + end + "Z");

    let diff = Math.abs(date1.getTime() - date2.getTime());
    let minutes = Math.floor(diff / 1000 / 60);

    if (minutes !== foundSchedule.eventDuration) {
      return res.status(400).json({
        err: `Error: Event duration must be ${foundSchedule.eventDuration} minutes`,
      });
    }

    const eventStart = Number(start.replace(":", "."));
    const eventEnd = Number(end.replace(":", "."));

    if (
      eventStart < foundSchedule.dayStart ||
      eventEnd > foundSchedule.dayEnd ||
      eventStart > foundSchedule.dayEnd
    ) {
      return res.status(400).json({
        err: "Error: Event start and end times must be within schedule",
      });
    }

    const foundClashingMenteeEvent = await Event.findOne({
      menteeEmail,
      day,
      $or: [
        { $and: [{ start: { $eq: eventStart } }, { end: { $eq: eventEnd } }] },
        { $and: [{ start: { $lt: eventEnd } }, { end: { $gt: eventStart } }] },
        {
          $and: [{ start: { $gt: eventStart } }, { start: { $lt: eventEnd } }],
        },
        { $and: [{ end: { $gt: eventStart } }, { end: { $lt: eventEnd } }] },
      ],
    });

    if (foundClashingMenteeEvent) {
      return res.status(400).json({
        err: "Error: You have already booked an event which clashes with this event",
      });
    }

    const foundClashingMentorEvent = await Event.findOne({
      mentorID,
      day,
      $or: [
        { $and: [{ start: { $eq: eventStart } }, { end: { $eq: eventEnd } }] },
        { $and: [{ start: { $lt: eventEnd } }, { end: { $gt: eventStart } }] },
        {
          $and: [{ start: { $gt: eventStart } }, { start: { $lt: eventEnd } }],
        },
        { $and: [{ end: { $gt: eventStart } }, { end: { $lt: eventEnd } }] },
      ],
    });

    if (foundClashingMentorEvent) {
      return res.status(400).json({
        err: "Error: Mentor is booked for this time",
      });
    }

    const newEvent = new Event({
      menteeEmail,
      mentorID,
      schedule,
      title,
      description,
      day,
      start: eventStart,
      end: eventEnd,
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

// @route   GET api/v1/event/get/byschedule/:scheduleID
// @desc    Get all the events for a given schedule
// @access  Public

router.get("/get/byschedule/:scheduleID", async (req, res) => {
  try {
    const foundEvents = await Event.find({ schedule: req.params.scheduleID });
    if (!foundEvents) {
      return res.status(404).json({ err: "No Events not found" });
    }

    res.status(200).json(foundEvents);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

// @route   GET api/v1/event/get/:userID
// @desc    Get all the events by a user
// @access  Public

router.get("/get/byuser/:userID", async (req, res) => {
  try {
    const foundEvents = await Event.findById({ mentorID: req.params.userID });
    if (!foundEvents) {
      return res.status(404).json({ err: "No events not found" });
    }

    res.status(200).json(foundEvents);
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
