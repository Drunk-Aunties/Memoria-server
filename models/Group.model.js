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
        members: [{ type: Schema.Types.ObjectId, ref: "User" }]    
    },
    {
        timestamps: true,
    }
);

const Group = model("Group", groupSchema);

module.exports = Group;
