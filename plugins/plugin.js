/* Copyright (C) 2025 Codex.
Licensed under the MIT License;
you may not use this file except in compliance with the License.
Codex - Ziyan
*/

const { Bixby, sleep } = require("../lib");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { PluginDB, installPlugin } = require("../lib/db/plugins");

// Command to install a plugin
Bixby(
  {
    pattern: "install",
    fromMe: true,
    desc: "Installs External plugins",
    type: "user",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage(message.jid, "_Send a plugin url_");

    try {
      var url = new URL(match);
    } catch (e) {
      console.log(e);
      return await message.sendMessage(message.jid, "_Invalid Url_");
    }

    // Handle GitHub Gist URLs
    if (url.host === "gist.github.com") {
      url.host = "gist.githubusercontent.com";
      url = url.toString() + "/raw";
    } else {
      url = url.toString();
    }

    var plugin_name;
    try {
      const { data, status } = await axios.get(url);
      if (status === 200) {
        // Extract the plugin name from the pattern in the plugin file
        var comand = data.match(/(?<=pattern:) ["'](.*?)["']/);
        plugin_name = comand[0].replace(/["']/g, "").trim().split(" ")[0];
        if (!plugin_name) {
          plugin_name = "__" + Math.random().toString(36).substring(8); // Generate a random name if no pattern is found
        }

        // Save the plugin file
        const pluginPath = path.join(__dirname, `${plugin_name}.js`);
        fs.writeFileSync(pluginPath, data);

        // Try to require the plugin to validate it
        try {
          require(pluginPath);
        } catch (e) {
          fs.unlinkSync(pluginPath); // Delete the invalid plugin file
          return await message.sendMessage(message.jid, "Invalid Plugin\n ```" + e + "```");
        }

        // Add the plugin to the database
        await installPlugin(url, plugin_name);

        await message.sendMessage(message.jid, `_New plugin installed : ${plugin_name}_`);
      }
    } catch (error) {
      console.error(error);
      return await message.sendMessage(message.jid, "Failed to fetch plugin");
    }
  }
);

// Command to list all installed plugins
Bixby(
  { pattern: "plugin", fromMe: true, desc: "plugin list", type: "user" },
  async (message, match) => {
    var mesaj = "";
    var plugins = await PluginDB.find();
    if (plugins.length < 1) {
      return await message.sendMessage(message.jid, "_No external plugins installed_");
    } else {
      plugins.map((plugin) => {
        mesaj += "```" + plugin.name + "```: " + plugin.url + "\n";
      });
      return await message.sendMessage(message.jid, mesaj);
    }
  }
);

// Command to remove a plugin
Bixby(
  {
    pattern: "remove",
    fromMe: true,
    desc: "Remove external plugins",
    type: "user",
  },
  async (message, match) => {
    if (!match) return await message.sendMessage(message.jid, "_Need a plugin name_");

    var plugin = await PluginDB.findOne({ name: match });

    if (!plugin) {
      return await message.sendMessage(message.jid, "_Plugin not found_");
    } else {
      await PluginDB.deleteOne({ name: match }); // Remove the plugin from the database
      delete require.cache[require.resolve(path.join(__dirname, `${match}.js`))]; // Clear the plugin from the require cache
      fs.unlinkSync(path.join(__dirname, `${match}.js`)); // Delete the plugin file
      await message.sendMessage(message.jid, `Plugin ${match} deleted`);
      await message.sendMessage(message.jid, `_Restarting..._`);
      sleep(500);
      return process.send("reset"); // Restart the application
    }
  }
);