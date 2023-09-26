const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");

// GET /api/user -  Retrieves a specific user
router.get("/users/email/:useremail", async (req, res, next) => {
    let result = await User.findOne({ email: req.params.useremail });
    res.json(result);
});
// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
    if (!req.file) {
        next(new Error("No file uploaded!"));
        return;
    }

    res.json({ fileUrl: req.file.path });
});

//  GET /api/users/:userId -  Retrieves a specific user by id
router.get("/users/id/:userId", (req, res, next) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    User.findById(userId)
        .populate("groupId")
        .then((user) => res.json(user))
        .catch((err) => {
            console.log("...", err);
            res.status(500).json({
                message: "Error getting user details",
                error: err,
            });
        });
});

// PUT  /api/users/:userId  -  Updates a specific user by id
router.put("/users/:userId", (req, res, next) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    const newDetails = {
        name: req.body.name,
        lastname: req.body.lastname,
        birthdate: req.body.birthdate,
        imageUrl: req.body.imageUrl,
    };

    User.findByIdAndUpdate(userId, newDetails, { new: true })
        .then((updatedUser) => res.json(updatedUser))
        .catch((err) => {
            console.log("Error updating user", err);
            res.status(500).json({
                message: "Error updating user",
                error: err,
            });
        });
});

// DELETE  /api/users/:userId -  Deletes a specific user by id
router.delete("/users/:userId", (req, res, next) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "Specified id is not valid" });
        return;
    }

    User.findByIdAndRemove(userId)
        .then(() =>
            res.json({
                message: `User with ${userId} is removed successfully.`,
            })
        )
        .catch((err) => {
            console.log("error deleting user", err);
            res.status(500).json({
                message: "error deleting user",
                error: err,
            });
        });
});

module.exports = router;
