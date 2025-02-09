/* Copyright (C) 2025 Codex.
Licensed under the MIT License;
you may not use this file except in compliance with the License.
Codex - Ziyan
*/

const { Bixby, isPrivate, isAdmin } = require("../lib");
const config = require("../config");
const { delay } = require("@whiskeysockets/baileys");
const {
   getReactStatus,
   setReactStatus,
   getReact,
   setPDMStatus,
   getPDMStatus,
   Banbot,
   getBanBotStatus,
   setBanBotStatus,
   deleteAllbanbot,
   savecall,
   deletecall,
   deleteAllcall,
   isCallBlocked,
   getTotalBlockedChats,
   enableCallBlockForAll,
   disableCallBlockForAll,
   isCallBlockEnabledForAll,
   StickBan,
   getStickBan,
   saveStickBan,
   deleteStickBan,
   saveUserBan,
   deleteUserBan  
   } = require("../lib/db");

Bixby({
     pattern: "settings",
     fromMe: true,
     desc: "Show All Additional Settings",
  },
  async (message, match) => {

     try {

        let mess = `│╭──[ *Settings* ]──㋰

││ *callblock* : Activate or Deactivate call Blocking for the current chat

││ *pdm* : Activate or Deactivate Group update notification for the current Group

││ *banbot* : Activate or Deactivate Detection and removal of other bots for the current group *Bot Must Be ADMIN*

││ *#ban* : Ban a user permanently from the current group (if the user try to join bot will remove him instantly *Bot Must Be ADMIN* )

││ *#Unban* : Release the user from banned list and add him back *Bot Must Be ADMIN*

││ *stickban* : Ban a Sticker from the current group (if the user try to send the sane sticker bot will remove him instantly *Bot Must Be ADMIN* )

││ *stickunban* : Release the sticker from banned list *Bot Must Be ADMIN*

││ *snapshot* : Saves the current metadata of the group and can be used to restore the group with the saved data later *bot must be admin*

│╰──㋰\n`.toUpperCase()

        return message.reply(mess);

     }
     catch (error) {
        console.error(error);
        return message.reply("_Error Deactivating Call Blocking!_");
     }

  });  

Bixby({
  pattern: "callblock",
  fromMe: true,
  desc: "Call blocking",
  dontAddCommandList: true,
}, async (message, match) => {
  const chatId = message.key.remoteJid;

  try {
    // Trim and convert match to lowercase
    const trimmedMatch = match ? match.trim().toLowerCase() : "";

    if (!trimmedMatch) {
      // If no argument is provided, send the callblock manager message
      const isBlocked = await isCallBlocked(chatId);
      const isAllBlocked = await isCallBlockEnabledForAll();
      const totalBlocked = await getTotalBlockedChats();
      const statusText = isBlocked || isAllBlocked ? "Activated" : "Deactivated";
      const managerText = `*Call Block Manager*\n\n- Call Block Status: ${statusText}\n- Total Call Blocked Chats: ${totalBlocked}\n\nUse:\n- \`callblock on\` to enable call block in this chat.\n- \`callblock off\` to disable call block in this chat.\n- \`callblock all\` to enable call block for all chats.\n- \`callblock deleteall\` to delete call block for all chats.`;
      return message.reply(managerText);
    }

    if (trimmedMatch === "on") {
      // Enable call block for the specific chat
      await savecall(chatId);
      return message.reply("_Call Blocking Activated for this chat!_");
    } else if (trimmedMatch === "off") {
      // Disable call block for the specific chat
      await deletecall(chatId);
      return message.reply("_Call Blocking Deactivated for this chat!_");
    } else if (trimmedMatch === "all") {
      // Enable call block for all chats
      await enableCallBlockForAll();
      return message.reply("_Call Blocking Activated for all chats!_");
    } else if (trimmedMatch === "deleteall") {
      // Delete call block for all chats
      await deleteAllcall();
      return message.reply("_Call Blocking Deactivated for all chats!_");
    } else {
      return message.reply("_Invalid command! Use `callblock on`, `callblock off`, `callblock all`, or `callblock deleteall`._");
    }
  } catch (error) {
    console.error(error);
    return message.reply("_Error processing your request!_");
  }
});


Bixby({
  pattern: "autoreact",
  fromMe: true,
  desc: "Auto React Messages",
  type: "user",
},
async (message, match) => {
  try {
    let { prefix } = message;
    let status = await getReactStatus(message.jid);
    let stat = status ? "on" : "off";

    if (!match) {
      let replyMsg = `Auto React Manager\n\nGroup: ${
        (await message.client.groupMetadata(message.jid)).subject
      }\nStatus: ${stat}\n\nAvailable Actions:\n\n- ${prefix}autoreact on: Enable auto react\n- ${prefix}autoreact off: Disable auto react`;

      return await message.reply(replyMsg);
    }

    if (match.trim() === "on") {
      if (status) return await message.reply("_Auto React is already enabled_");
      await setReactStatus(message.jid, true);
      return await message.reply("_Auto React enabled_");
    }

    if (match.trim() === "off") {
      if (!status) return await message.reply("_Auto React is already disabled_");
      await setReactStatus(message.jid, false);
      return await message.reply("_Auto React disabled_");
    }

    return await message.reply("_Invalid command. Use `autoreact on` or `autoreact off`._");
  } catch (error) {
    console.error("Error in autoreact handler:", error);
    return await message.reply("_An error occurred while processing your request._");
  }
});

Bixby({
    on: "message",
    fromMe: false,
    dontAddCommandList: true
},
async (message, match, m) => {
    try {
        // Fetch all React documents from the database
        const ReactList = await getReact();

        // Find the document for the current chat ID (message.jid)
        const chatReact = ReactList.find(item => item.chatId === message.jid);

        // Check if auto-react is enabled for this chat
        if (chatReact && chatReact.status === true) {
            // If auto-react is enabled for this chat, send a random emoji reaction
            const reactionMessage = {
                react: {
                    text: await getRandomEmoji(),
                    key: message.key
                }
            };

            // Send the reaction
            await message.client.sendMessage(message.jid, reactionMessage);
        }
    } catch (error) {
        console.error("[Error in autoreact handler]:", error);
    }
});

// Function to get a random emoji
async function getRandomEmoji() {
    const emojis = [
        "😀", "😁", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😜", "😝", "😛", "🤑", "🤗", "🤩", "🥳", "😎", "😺", "😸", "😹", "😻", "😼", "👍", "🙏", "💖", "🎉", "🔥", "🌟", "💯", "🎈"
    ];
    const randomIndex = Math.floor(Math.random() * emojis.length);
    return emojis[randomIndex];
}

Bixby({
  pattern: "pdm",
  fromMe: isPrivate,
  desc: "Promote Demote Messages",
  dontAddCommandList: true,
}, async (message, match) => {
  const chatId = message.key.remoteJid;
  try {
    if (!message.isGroup) return;

    let isadmin = await isAdmin(message.jid, message.key.participant, message.client);
    if (!isadmin) return;

    const currentStatus = await getPDMStatus(chatId);

    if (match.trim() === "on") {
      if (currentStatus) {
        return message.reply("_PDM is already activated!_");
      } else {
        await setPDMStatus(chatId, true);
        return message.reply("_PDM Activated!_");
      }
    } else if (match.trim() === "off") {
      if (!currentStatus) {
        return message.reply("_PDM is already deactivated!_");
      } else {
        await setPDMStatus(chatId, false);
        return message.reply("_PDM Deactivated!_");
      }
    } else if (match.trim() === "status") {
      const status = await getPDMStatus(chatId);
      return message.reply(`_PDM Status: ${status ? "ON" : "OFF"}_`);
    } else {
      return message.reply("_Invalid command. Use `pdm on`, `pdm off`, or `pdm status`._");
    }
  } catch (error) {
    console.error(error);
    return message.reply("_Error processing PDM command!_");
  }
});

Bixby({
  pattern: "banbot",
  fromMe: isPrivate,
  desc: "Ban other Bots in group",
  dontAddCommandList: true,
}, async (message, match) => {
  const chatId = message.key.remoteJid;
  try {
    if (!message.isGroup) return;

    // Check if the user is an admin
    let isadmin = await isAdmin(message.jid, message.key.participant, message.client);
    if (!isadmin) return;

    // If no match is provided, open the Banbot Manager
    if (!match) {
      const currentStatus = await getBanBotStatus(chatId);
      const totalEnabled = await Banbot.countDocuments();

      const managerMessage = `
*Banbot Manager*

- Current Status: ${currentStatus === "enabled" ? "✅ Enabled" : "❌ Disabled"}
- Total Chats Enabled: ${totalEnabled}

*Options:*
1. \`/banbot on\` - Enable Banbot for this chat.
2. \`/banbot off\` - Disable Banbot for this chat.
3. \`/banbot deleteall\` - Disable Banbot for all chats.
      `;

      return message.reply(managerMessage);
    }

    // Handle "on", "off", and "deleteall" commands
    if (match.trim() === "on") {
      const currentStatus = await getBanBotStatus(chatId);
      if (currentStatus === "enabled") {
        return message.reply("_Bot Banning is already activated for this chat!_");
      } else {
        await setBanBotStatus(chatId, "enabled");
        return message.reply("_Bot Banning Activated!_");
      }
    } else if (match.trim() === "off") {
      const currentStatus = await getBanBotStatus(chatId);
      if (currentStatus === "disabled") {
        return message.reply("_Bot Banning is already deactivated for this chat!_");
      } else {
        await setBanBotStatus(chatId, "disabled");
        return message.reply("_Bot Banning Deactivated!_");
      }
    } else if (match.trim() === "deleteall") {
      const totalEnabled = await Banbot.countDocuments();
      if (totalEnabled === 0) {
        return message.reply("_No chats have Bot Banning activated!_");
      } else {
        await deleteAllbanbot();
        return message.reply("_Bot Banning Deactivated for All Chats!_");
      }
    } else {
      // If no valid command is provided, show usage instructions
      return message.reply("_Please use a valid command: `on`, `off`, or `deleteall`._");
    }
  } catch (error) {
    console.error(error);
    return message.reply("_Error activating Bot Banning!_");
  }
});

Bixby({
  on: "message",
  fromMe: false,
  dontAddCommandList: true,
}, async (message, match) => {
  let aurora = message.text ? message.text.includes("Bot Detected!") : false;
  if (aurora) return;

  const chatId = message.key.remoteJid;

  // Check if banbot is enabled for this chat
  const banbotEnabled = await getBanBotStatus(chatId);
  if (banbotEnabled !== "enabled") return; // Exit if banbot is not enabled for this chat

  const banbotlist = await Banbot.findOne({ chatId });

  if (banbotlist) {
    console.log(message.isBaileys);
    if (message.isBaileys) {
      let { key } = await message.reply("*_Bot Detected!_*");

      // Check if the sender is an admin
      let isyouadmin = await isAdmin(message.jid, message.key.participant, message.client);
      if (isyouadmin) {
        return await message.client.sendMessage(message.jid, {
          text: "_Verified Admin!_",
          edit: key,
        });
      }

      // Check if the bot user is an admin
      const ismeadmin = await isAdmin(message.jid, message.user, message.client);
      if (!ismeadmin) return;

      // Remove the bot user from the group
      const zjid = message.key.participant;
      const jid = parsedJid(zjid);
      delay(500);
      await message.client.groupParticipantsUpdate(message.jid, jid, "remove");

      return await message.client.sendMessage(message.jid, {
        text: `_@${jid[0].split("@")[0]} kicked for using Bot_`,
        edit: key,
      }, {
        mentions: [jid],
      });
    }
  }
});

Bixby(
  {
    pattern: "stickban",
    fromMe: isPrivate, // Replace `isPrivate` with your logic for private/public commands
    desc: "Ban a sticker in group",
  },
  async (message, match) => {
    try {
      if (match === " list") {
        const chatId = message.key.remoteJid; // Get the chat ID
        const BannIds = await getStickBan(chatId); // Fetch banned sticker IDs
        if (!BannIds) return await message.reply("_No Stickers are Banned_");

        let mggs = `*Banned Sticker ID:*\n`;
        BannIds.forEach((BanneUsers) => {
          mggs += "- " + BanneUsers + "\n";
        });
        return await message.reply(mggs); // Send the list of banned stickers
      } else if (!message.reply_message || !message.reply_message.sticker) {
        return await message.reply("_Reply to a sticker_");
      }

      // Check if the user is an admin
      let isadmin = await isAdmin(message.jid, message.key.participant, message.client);
      if (!isadmin) return await message.reply("_You are not an admin_");

      const StickId = message.reply_message.sticker.mediaKey; // Get the sticker media key
      await saveStickBan(message.jid, StickId); // Save the banned sticker
      return await message.reply(`_Sticker Banned successfully._`);
    } catch (error) {
      console.error("[Error]:", error);
      await message.reply("_An error occurred while processing your request._");
    }
  }
);

// Command to unban a sticker
Bixby(
  {
    pattern: "stickunban",
    fromMe: isPrivate, // Replace `isPrivate` with your logic for private/public commands
    desc: "Unban a sticker in group",
  },
  async (message, match) => {
    try {
      if (!message.reply_message || !message.reply_message.sticker) {
        return await message.reply("_Reply to a sticker_");
      }

      // Check if the user is an admin
      let isadmin = await isAdmin(message.jid, message.key.participant, message.client);
      if (!isadmin) return await message.reply("_You are not an admin_");

      const StickId = message.reply_message.sticker.mediaKey; // Get the sticker media key
      const del = await deleteStickBan(message.jid, StickId); // Delete the banned sticker

      if (!del) {
        await message.reply("_Sticker is not Banned._");
      } else {
        await message.reply(`_Sticker Unbanned successfully._`);
      }
    } catch (error) {
      console.error("[Error]:", error);
      await message.reply("_An error occurred while processing your request._");
    }
  }
);

Bixby({
  on: "message",
  fromMe: false,
  dontAddCommandList: true
}, async (message, match) => {
  try {
    // Check if the message contains a sticker
    if (!message.sticker) return;

    // Get the sticker's media key and chat ID
    let mediakey = message.sticker.mediaKey;
    const chatId = message.key.remoteJid;

    // Fetch the list of banned sticker IDs for the chat
    const BannIds = await getStickBan(chatId);
    if (!BannIds) return; // No banned stickers in this chat

    console.log(BannIds); // Log the banned sticker IDs for debugging

    // Ensure config.SUDO is defined and handle single/multiple SUDO users
    let sudoList = [];
    if (config.SUDO) {
      sudoList = config.SUDO.split(',').map(Number).filter(id => !isNaN(id)); // Filter out NaN values
    }

    // Get the participant's JID and ID
    const zjid = message.key.participant;
    const id = message.key.participant.split("@")[0];

    // Check if the sticker is banned
    BannIds.forEach(async (BanneUsers) => {
      if (BanneUsers === mediakey) {
        // If the sticker is banned and the user is not a SUDO user
        if (!sudoList.includes(Number(id))) {
          console.log("Banned Sticker");

          // Notify the group about the banned sticker
          await message.client.sendMessage(chatId, {
            text: "_Banned Sticker_"
          });

          // Delay for 500ms before removing the participant
          await delay(500);

          // Remove the participant from the group
          await message.client.groupParticipantsUpdate(chatId, [zjid], "remove");

          // Delete the banned sticker message
          return await message.client.sendMessage(chatId, {
            delete: message.key
          });
        } else {
          // If the user is a SUDO user, notify the group
          return await message.client.sendMessage(chatId, {
            text: "_Sudo user is using Banned Sticker_"
          });
        }
      }
    });
  } catch (error) {
    console.error("[Error]:", error);
  }
});

Bixby(
  {
    pattern: "#ban",
    fromMe: isPrivate,
    desc: "Ban a user in the group",
  },
  async (message, match) => {
    try {
      if (!message.isGroup) return;

      match = match || message.reply_message.jid;

      let me = await fromMe(message.participant);
      let key;
      if (me) {
        key = await message.key;
      } else {
        ({ key } = await message.reply("_Processing That Request!_"));
      }

      match = match || message.reply_message.jid;
      if (!match)
        return await message.client.sendMessage(message.jid, {
          text: "_Mention user to Ban!_",
          edit: key,
        });

      let isadmin = await isAdmin(message.jid, message.key.participant, message.client);
      if (!isadmin)
        return await message.client.sendMessage(message.jid, {
          text: "_You're not admin!_",
          edit: key,
        });

      let ismeadmin = await isAdmin(message.jid, message.user, message.client);
      if (!ismeadmin)
        return await message.client.sendMessage(message.jid, {
          text: "_I'm not admin!_",
          edit: key,
        });

      let jid = parsedJid(match);
      let add = await saveUserBan(message.jid, jid[0]);

      if (!add) {
        await message.reply("_User is already Banned!_");
      } else {
        setTimeout(async () => {
          await message.kick(jid);
        }, 1000);
        return await message.client.sendMessage(message.jid, {
          text: `_User is Permanently Banned From This Group!_`,
          edit: key,
        });
      }
    } catch (error) {
      console.error("[Error]:", error);
    }
  }
);

Bixby(
  {
    pattern: "#unban",
    fromMe: isPrivate,
    desc: "Unban a user in the group",
  },
  async (message, match) => {
    try {
      if (!message.isGroup) return;

      match = match || message.reply_message.jid;

      let me = await fromMe(message.participant);
      let key;
      if (me) {
        key = await message.key;
      } else {
        ({ key } = await message.reply("_Processing That Request!_"));
      }

      match = match || message.reply_message.jid;
      if (!match)
        return await message.client.sendMessage(message.jid, {
          text: "_Mention user to Unban!_",
          edit: key,
        });

      let isadmin = await isAdmin(message.jid, message.key.participant, message.client);
      if (!isadmin)
        return await message.client.sendMessage(message.jid, {
          text: "_You're not admin!_",
          edit: key,
        });

      let ismeadmin = await isAdmin(message.jid, message.user, message.client);
      if (!ismeadmin)
        return await message.client.sendMessage(message.jid, {
          text: "_I'm not admin!_",
          edit: key,
        });

      let jid = parsedJid(match);
      let del = await deleteUserBan(message.jid, jid[0]);

      if (!del) {
        await message.reply("_User is not Banned!_");
      } else {
        setTimeout(async () => {
          return await message.client.sendMessage(message.jid, {
            text: `_User is Unbanned For This Group!_`,
            edit: key,
          });
        }, 1000);
        await message.add(jid);
      }
    } catch (error) {
      console.error("[Error]:", error);
    }
  }
);