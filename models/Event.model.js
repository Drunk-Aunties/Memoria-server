const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
    {
        title: {
            type: String,
        },
        content: {
            type: String,
        },
        imageUrl: {
            type: String,
        },
        members: [{ type: Schema.Types.ObjectId, ref: "User" }],
        groupId: { type: Schema.Types.ObjectId, ref: "Group" },
        date: String,
        comments: [String],
    },
    {
        timestamps: true,
    }
);

const Event = model("Event", eventSchema);

module.exports = Event;
