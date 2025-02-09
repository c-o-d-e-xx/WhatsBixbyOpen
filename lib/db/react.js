const mongoose = require('mongoose');

// Define the schema for the React collection
const reactSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true, // Default status is true
  },
});

// Create the React model
const React = mongoose.model('React', reactSchema);

// Function to get all React documents
async function getReact() {
  return await React.find({});
}

// Function to save a new React document
async function saveReact(chatId) {
  const react = new React({ chatId });
  return await react.save();
}

// Function to delete all React documents
async function deleteAllReact() {
  return await React.deleteMany({});
}

// Function to get the status of a specific React document by chatId
async function getReactStatus(chatId) {
  try {
    const existingReact = await React.findOne({ chatId });
    return existingReact ? existingReact.status : false;
  } catch (error) {
    console.error('Error getting status:', error);
    return false;
  }
}

// Function to set the status of a specific React document by chatId

async function setReactStatus(chatId, newStatus) {
  try {
    let existingReact = await React.findOne({ chatId });

    if (!existingReact) {
      // Create a new document if it doesn't exist
      existingReact = new React({ chatId, status: newStatus });
      await existingReact.save();
    } else {
      // Update the existing document with the new status
      await React.updateOne({ chatId }, { status: newStatus });
    }

    return newStatus;
  } catch (error) {
    console.error("Error in setStatus:", error);
    throw error; // Re-throw the error for further handling
  }
}

// Function to delete a specific React document by chatId
async function deleteReact(chatId) {
  const existingReact = await React.findOne({ chatId });

  if (existingReact) {
    await existingReact.deleteOne();
  }
}

module.exports = {
  React,
  getReact,
  saveReact,
  deleteAllReact,
  getReactStatus,
  setReactStatus,
  deleteReact,
};