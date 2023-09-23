const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");
const Group = require("../models/Group.model");
const Event = require("../models/Event.model");
const { isGroupMember } = require("../middleware/isGroupMember");



//  POST /api/gropus  -  Creates a new group
router.post("/groups", fileUploader.single("imageUrl"), (req, res, next) => {
    const { name, description } = req.body;

    const newGroup = {
        name,
        description,
        members: [],
        imageUrl: req.file ? req.file.path : null,
    };

    Group.create(newGroup)
        .then((response) => res.json(response))
        .catch((err) => {
            console.log("Error creating new group...", err);
            res.status(500).json({
                message: "Error creating a new group",
                error: err,
            });
        });
});

// GET /api/groups -  Retrieves all of the groups
router.get("/groups", (req, res, next) => {
    Group.find()
        .populate("members")
        .then((allGroups) => res.json(allGroups))
        .catch((err) => {
            console.log("Error getting list of groups...", err);
            res.status(500).json({
                message: "Error getting list of group",
                error: err,
            });
        });
});

//  GET /api/groups/:groupId -  Retrieves a specific group by id
router.get("/groups/:groupId", isAuthenticated, (req, res, next) => {
    //console.log(req.payload);
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
        
    }

    // Each Group document has a `tasks` array holding `_id`s of Task documents
    // We use .populate() method to get swap the `_id`s for the actual Task documents
    Group.findById(groupId)
        .populate("members")
        .then((group) => {
            //console.log(group.members);
            console.log(group.members.find((element) => element.email === req.payload.email))
            if (group.members.find((element) => element.email === req.payload.email))
            {res.json(group)}
            else {res.status(401).json({
                message: "You are not a member of this group",
            });}
        })

        .catch((err) => {
            console.log("...", err);
            res.status(500).json({
                message: "Error getting group details",
                error: err,
            });
        });
});

// PUT  /api/groups/:groupId  -  Updates a specific group by id
router.put("/groups/:groupId", (req, res, next) => {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    const newDetails = {
        name: req.body.name,
        description: req.body.description,
        members: req.body.members,
    };

    Group.findByIdAndUpdate(groupId, newDetails, { new: true })
        .then((updatedGroup) => res.json(updatedGroup))
        .catch((err) => {
            console.log("Error updating group", err);
            res.status(500).json({
                message: "Error updating group",
                error: err,
            });
        });
});

// DELETE  /api/groups/:groupId  -  Deletes a specific group by id
router.delete("/groups/:groupId", (req, res, next) => {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    Group.findByIdAndRemove(groupId)
        .then(() =>
            res.json({
                message: `Group with ${groupId} is removed successfully.`,
            })
        )
        .catch((err) => {
            console.log("error deleting group", err);
            res.status(500).json({
                message: "error deleting group",
                error: err,
            });
        });
});

module.exports = router;
