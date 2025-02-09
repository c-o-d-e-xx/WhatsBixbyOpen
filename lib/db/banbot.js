/* Copyright (C) 2025 Codex.
Licensed under the MIT License;
you may not use this file except in compliance with the License.
Codex - Ziyan
*/

const mongoose = require('mongoose');

// Define the schema for the banbot collection
const banbotSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true
  }
});

// Create the Mongoose model
const Banbot = mongoose.model('Banbot', banbotSchema);

// Function to get all banbot entries
async function getbanbot() {
  return await Banbot.find({});
}

// Function to save a new banbot entry
async function savebanbot(chatId) {
  const newBanbot = new Banbot({ chatId });
  return await newBanbot.save();
}

// Function to delete all banbot entries
async function deleteAllbanbot() {
  return await Banbot.deleteMany({});
}

async function getBanBotStatus(chatId) {
  const banbotlist = await Banbot.findOne({ chatId });
  return banbotlist ? "enabled" : "disabled";
}

// Helper function to set the status of banbot for a specific chat
async function setBanBotStatus(chatId, status) {
  if (status === "enabled") {
    await savebanbot(chatId);
  } else if (status === "disabled") {
    await Banbot.deleteOne({ chatId });
  }
}

module.exports = {
  Banbot,
  getbanbot,
  savebanbot,
  deleteAllbanbot,
  getBanBotStatus,
  setBanBotStatus,
};