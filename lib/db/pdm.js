const mongoose = require('mongoose');

// Define the schema for the PDM collection
const PDMSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true, // Default status is true (on)
  },
});

// Create the PDM model
const PDM = mongoose.model('PDM', PDMSchema);

// Function to get all PDM documents
async function getPDM() {
  return await PDM.find({});
}

// Function to save a new PDM document
async function savePDM(chatId) {
  const pdm = new PDM({ chatId });
  return await pdm.save();
}

// Function to delete all PDM documents
async function deleteAllPDM() {
  return await PDM.deleteMany({});
}

// Function to get the status of a specific PDM document by chatId
async function getPDMStatus(chatId) {
  try {
    const existingPDM = await PDM.findOne({ chatId });
    return existingPDM ? existingPDM.status : false;
  } catch (error) {
    console.error('Error getting status:', error);
    return false;
  }
}

// Function to set the status of a specific PDM document by chatId
async function setPDMStatus(chatId, newStatus) {
  try {
    let existingPDM = await PDM.findOne({ chatId });

    if (!existingPDM) {
      // Create a new document if it doesn't exist
      existingPDM = new PDM({ chatId, status: newStatus });
      await existingPDM.save();
    } else {
      // Update the existing document with the new status
      await PDM.updateOne({ chatId }, { status: newStatus });
    }

    return newStatus;
  } catch (error) {
    console.error("Error in setStatus:", error);
    throw error; // Re-throw the error for further handling
  }
}

// Function to delete a specific PDM document by chatId
async function deletePDM(chatId) {
  const existingPDM = await PDM.findOne({ chatId });

  if (existingPDM) {
    await existingPDM.deleteOne();
  }
}

module.exports = {
  PDM,
  getPDM,
  savePDM,
  deleteAllPDM,
  getPDMStatus,
  setPDMStatus,
  deletePDM,
};