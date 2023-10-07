//File for creating test data if needed

// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");
const User = require("../models/User.model");

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI = "mongodb://127.0.0.1:27017/my-project-server";

mongoose
    .connect(MONGO_URI)
    .then((x) => {
        const dbName = x.connections[0].name;
        console.log(`Connected to Mongo! Database name: "${dbName}"`);
    })
    .catch((err) => {
        console.error("Error connecting to mongo: ", err);
    });

require("dotenv").config();

let users = [
    {
        name: "Bob",
        email: "bob@bob.com",
        password: "helloworld-123",
    },
    {
        name: "Alice",
        email: "alice@alice.com",
        password: "helloworld-123",
    },
    {
        name: "Jack",
        email: "jack@jack.com",
        password: "helloworld-123",
    },
];

//Connects to DB, deletes all plants, creates new array of plants
async function executeSeed() {
    try {
        let result = await mongoose.connect(MONGO_URI);
        console.log(
            `Connected to Mongo! Database name: "${result.connections[0].name}"`
        );
        //result = await User.deleteMany({});
        result = await User.insertMany(users);
        await mongoose.connection.close();
    } catch (err) {
        console.error("Error connecting to DB: ", err);
    }
}

executeSeed();
