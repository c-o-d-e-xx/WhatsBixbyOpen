const mongoose = require("mongoose");
const got = require("got");
const fs = require("fs");
const path = require("path");

// Define the Plugin Schema
const PluginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

// Create the Plugin model
const PluginDB = mongoose.model("Plugin", PluginSchema);

// Function to install a plugin
async function installPlugin(adres, file) {
  const existingPlugin = await PluginDB.findOne({ url: adres });

  if (existingPlugin) {
    return false; // Plugin already exists
  } else {
    return await PluginDB.create({ url: adres, name: file }); // Create new plugin entry
  }
}

// Function to remove a plugin
async function removePlugin(name) {
  const existingPlugin = await PluginDB.findOne({ name });

  if (existingPlugin) {
    await PluginDB.deleteOne({ name }); // Delete the plugin from the database
    return true;
  } else {
    return false; // Plugin not found
  }
}

async function getandRequirePlugins() {
  try {
    let plugins = await PluginDB.find(); // Assuming PluginDB is defined and connected

    for (const plugin of plugins) {
      try {
        // Fetch the plugin code from the URL
        const res = await got(plugin.url);

        // Define the path to save the plugin file
        const pluginPath = path.join(__basedir, "plugins", `${plugin.name}.js`);

        // Write the plugin code to the file
        fs.writeFileSync(pluginPath, res.body);

        // Require the plugin
        require(pluginPath);

        console.log("Installed plugin:", plugin.name);
      } catch (e) {
        console.error("Error loading plugin:", plugin.name, e);
      }
    }
  } catch (e) {
    console.error("Error fetching plugins from database:", e);
  }
}

// Export the functions and model
module.exports = { PluginDB, installPlugin, removePlugin, getandRequirePlugins };