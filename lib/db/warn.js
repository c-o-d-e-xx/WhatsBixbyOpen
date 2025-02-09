/* Copyright (C) 2025 Codex.
Licensed under the MIT License;
you may not use this file except in compliance with the License.
Codex - Ziyan
*/

const mongoose = require('mongoose');

const warnSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  reasons: {
    type: [String], // Array of strings to store reasons
    default: [],
  },
  warnCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Mongoose model
const WarnsDB = mongoose.model('Warns', warnSchema);

// Function to get warns for a user
async function getWarns(userId) {
  return await WarnsDB.findOne({ userId });
}

// Function to save a warn for a user
async function saveWarn(userId, reason) {
  let existingWarn = await getWarns(userId);

  if (existingWarn) {
    existingWarn.warnCount += 1;

    if (reason) {
      existingWarn.reasons.push(reason);
    }

    existingWarn.updatedAt = new Date();
    await existingWarn.save();
  } else {
    existingWarn = await WarnsDB.create({
      userId,
      reasons: reason ? [reason] : [],
      warnCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return existingWarn;
}

// Function to reset warns for a user
async function resetWarn(userId) {
  return await WarnsDB.deleteOne({ userId });
}


module.exports = {
  WarnsDB,
  getWarns,
  saveWarn,
  resetWarn,
};