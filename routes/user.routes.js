const router = require("express").Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");

// GET /api/user -  Retrieves a specific user 
router.get("/user/:useremail", async (req, res, next) =>  {
    let result = await User.findOne({email: req.params.useremail});
    res.json(result)
});

module.exports = router;
