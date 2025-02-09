const config = require("../../config");
const MONGODB_URI = config.MONGODB_URI;
const mongoose = require("mongoose");
console.log("MONGODB_URI:", typeof MONGODB_URI, MONGODB_URI);

function connectMongoDb() {
    // Validate that the MONGODB_URI is defined
    if (!MONGODB_URI) {
        console.error("❌ MONGODB_URI is not defined in the configuration.");
        process.exit(1); // Exit the process if URI is missing
    }

    // Connect to MongoDB
    mongoose
        .connect(MONGODB_URI)
        .then(() => {
            console.log("✅ Successfully connected to MongoDB.");
        })
        .catch((error) => {
            console.error("❌ MongoDB connection error:", error.message);
            process.exit(1); // Exit the process on connection failure
        });

    const db = mongoose.connection;

    // Handle additional error events
    db.on("error", (error) => {
        console.error("❌ MongoDB error occurred:", error.message);
    });
}

module.exports = { connectMongoDb };
