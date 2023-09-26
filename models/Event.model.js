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
        favorite: Boolean,
        groupId: { type: Schema.Types.ObjectId, ref: "Group" },
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        date: String,
        comments: [String],
    },
    {
        timestamps: true,
    }
);

const Event = model("Event", eventSchema);

module.exports = Event;
