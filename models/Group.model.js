const { Schema, model } = require("mongoose");

const groupSchema = new Schema(
    {
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        imageUrl: {
            type: String,
        },
        members: [{ type: Schema.Types.ObjectId, ref: "User" }],
        events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    },
    {
        timestamps: true,
    }
);

const Group = model("Group", groupSchema);

module.exports = Group;
