/* Copyright (C) 2025 Codex.
Licensed under the MIT License;
you may not use this file except in compliance with the License.
Codex - Ziyan
*/

const mongoose = require("mongoose");

// Define the UserBan schema
const UserBanSchema = new mongoose.Schema({
  chatid: {
    type: String,
    required: true,
  },
  bannedid: {
    type: String,
    required: true,
  },
});

// Create the UserBan model
const UserBan = mongoose.model("UserBan", UserBanSchema);

// Function to get all chat IDs (not used in the original code, but included for completeness)
async function getchatid() {
  try {
    const allchatids = await UserBan.find({});

    if (allchatids.length < 1) {
      return false;
    } else {
      return allchatids;
    }
  } catch (error) {
    console.error("Error fetching chat IDs:", error);
    return false;
  }
}

// Function to get banned users for a specific chat ID
async function getUserBan(jid = null) {
  try {
    const bannedUsers = await UserBan.find({ chatid: jid });

    if (bannedUsers.length < 1) {
      return null;
    } else {
      // Return an array of banned IDs
      return bannedUsers.map((item) => item.bannedid);
    }
  } catch (error) {
    console.error("Error fetching banned users:", error);
    return null;
  }
}

// Function to save a banned user for a specific chat ID
async function saveUserBan(jid = null, bannedid = null) {
  try {
    const existingBan = await UserBan.findOne({ chatid: jid, bannedid: bannedid });

    if (!existingBan) {
      // Create a new entry if it doesn't exist
      const newBan = new UserBan({
        chatid: jid,
        bannedid: bannedid,
      });
      return await newBan.save();
    } else {
      // Update the existing entry (though in this case, it's not necessary since the data is the same)
      return existingBan;
    }
  } catch (error) {
    console.error("Error saving banned user:", error);
    return false;
  }
}

// Function to delete a banned user for a specific chat ID
async function deleteUserBan(jid = null, bannedid = null) {
  try {
    const deletedBan = await UserBan.findOneAndDelete({ chatid: jid, bannedid: bannedid });

    if (!deletedBan) {
      return false;
    } else {
      return deletedBan;
    }
  } catch (error) {
    console.error("Error deleting banned user:", error);
    return false;
  }
}

// Export the functions and model
module.exports = {
  UserBan,
  getUserBan,
  saveUserBan,
  deleteUserBan,
};