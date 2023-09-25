const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");
const Group = require("../models/Group.model");
const Event = require("../models/Event.model");

//  POST /api/events  -  Creates a new event
router.post("/events", (req, res, next) => {
    const { title, content, imageUrl,groupId } = req.body;

    const newEvent = {
        title,
        content,
        members: [],
        imageUrl,
        groupId,
    };

    Event.create(newEvent)
        .then((response) => res.json(response))
        .catch((err) => {
            console.log("Error creating new event...", err);
            res.status(500).json({
                message: "Error creating a new event",
                error: err,
            });
        });
});

// GET /api/events -  Retrieves all of the events
router.get("/events", (req, res, next) => {
    Event.find()
        .populate("members")
        .populate("community")
        .then((allEvents) => res.json(allEvents))
        .catch((err) => {
            console.log("Error getting list of events...", err);
            res.status(500).json({
                message: "Error getting list of events",
                error: err,
            });
        });
});

//  GET /api/events/:eventId -  Retrieves a specific event by id
router.get("/events/:eventId", (req, res, next) => {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    // Each Event document has a `tasks` array holding `_id`s of Task documents
    // We use .populate() method to get swap the `_id`s for the actual Task documents
    Event.findById(eventId)
        .populate("members")
        .populate("groupId")
        .then((event) => res.json(event))
        .catch((err) => {
            console.log("...", err);
            res.status(500).json({
                message: "Error getting event details",
                error: err,
            });
        });
});

// PUT  /api/events/:eventId  -  Updates a specific event by id
router.put("/events/:eventId", (req, res, next) => {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    const newDetails = {
        title: req.body.title,
        content: req.body.content,
        members: req.body.members,
    };

    Event.findByIdAndUpdate(eventId, newDetails, { new: true })
        .then((updatedEvent) => res.json(updatedEvent))
        .catch((err) => {
            console.log("Error updating event", err);
            res.status(500).json({
                message: "Error updating event",
                error: err,
            });
        });
});

// DELETE  /api/events/:eventId -  Deletes a specific event by id
router.delete("/events/:eventId", (req, res, next) => {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Event.findByIdAndRemove(eventId)
        .then(() =>
            res.json({
                message: `Event with ${eventId} is removed successfully.`,
            })
        )
        .catch((err) => {
            console.log("error deleting event", err);
            res.status(500).json({
                message: "error deleting event",
                error: err,
            });
        });
});
// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
    // console.log("file is: ", req.file)

    if (!req.file) {
        next(new Error("No file uploaded!"));
        return;
    }

    // Get the URL of the uploaded file and send it as a response.
    // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

    res.json({ fileUrl: req.file.path });
});

// GET /api/groups/:groupsId/events -  Retrieves all of the events
router.get("/groups/:groupId/events", (req, res, next) => {
    Event.find({groupId: req.params.groupId})
        .then((allEvents) => res.json(allEvents))
        .catch((err) => {
            console.log("Error getting list of events...", err);
            res.status(500).json({
                message: "Error getting list of events",
                error: err,
            });
        });
});

module.exports = router;
