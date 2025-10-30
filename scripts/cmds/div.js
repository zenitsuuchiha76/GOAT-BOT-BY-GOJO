const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "div",
    version: "1.2",
    author: "SaGor",
    role: 2,
    category: "owner",
    shortDescription: { en: "Manage DEV list" },
    longDescription: { en: "Add, remove, list DEV IDs" },
    guide: { en: "{pn} add/remove/list ..." }
  },

  langs: {
    en: {
      added: "✅ | Added to DEV:\n%2",
      already: "⚠ | Already in DEV:\n%2",
      missingIdAdd: "⚠ | Please enter ID or tag user to add to DEV.",
      removed: "✅ | Removed from DEV:\n%2",
      notIn: "⚠ | Not in DEV:\n%2",
      missingIdRemove: "⚠ | Please enter ID or tag user to remove from DEV."
    }
  },

  onStart: async function ({ message, event, usersData, args, getLang, api }) {
    const permission = global.GoatBot?.config?.DEV || [];
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("<- মাদারচুদ বট কি তর বাপের নাকি..!😾", event.threadID, event.messageID);
    }

    const sub = args[0];

    switch (sub) {
      case "add":
      case "-a": {
        if (!args[1] && Object.keys(event.mentions).length === 0 && !event.messageReply)
          return message.reply(getLang("missingIdAdd"));

        let uids = [];
        if (Object.keys(event.mentions).length > 0)
          uids = Object.keys(event.mentions);
        else if (event.messageReply)
          uids.push(event.messageReply.senderID);
        else
          uids = args.slice(1).filter(arg => !isNaN(arg));

        const already = [];
        const added = [];

        for (const uid of uids) {
          if (config.DEV.includes(uid))
            already.push(uid);
          else {
            config.DEV.push(uid);
            added.push(uid);
          }
        }

        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

        const getNames = await Promise.all(
          uids.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
        );

        return message.reply(
          (added.length > 0
            ? getLang("added", added.length, getNames.filter(e => added.includes(e.uid)).map(e => `• ${e.name} (${e.uid})`).join("\n"))
            : "") +
          (already.length > 0
            ? "\n" + getLang("already", already.length, getNames.filter(e => already.includes(e.uid)).map(e => `• ${e.name} (${e.uid})`).join("\n"))
            : "")
        );
      }

      case "remove":
      case "-r": {
        if (!args[1] && Object.keys(event.mentions).length === 0 && !event.messageReply)
          return message.reply(getLang("missingIdRemove"));

        let uids = [];
        if (Object.keys(event.mentions).length > 0)
          uids = Object.keys(event.mentions);
        else if (event.messageReply)
          uids.push(event.messageReply.senderID);
        else
          uids = args.slice(1).filter(arg => !isNaN(arg));

        const removed = [];
        const notIn = [];

        for (const uid of uids) {
          if (config.DEV.includes(uid)) {
            config.DEV.splice(config.DEV.indexOf(uid), 1);
            removed.push(uid);
          } else {
            notIn.push(uid);
          }
        }

        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

        const getNames = await Promise.all(
          uids.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
        );

        return message.reply(
          (removed.length > 0
            ? getLang("removed", removed.length, getNames.filter(e => removed.includes(e.uid)).map(e => `• ${e.name} (${e.uid})`).join("\n"))
            : "") +
          (notIn.length > 0
            ? "\n" + getLang("notIn", notIn.length, getNames.filter(e => notIn.includes(e.uid)).map(e => `• ${e.name} (${e.uid})`).join("\n"))
            : "")
        );
      }

      case "list":
      case "-l": {
        const getNames = await Promise.all(
          config.DEV.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
        );

        const memberList = getNames.map((e, i) => `┃👤 ${i + 1}. ${e.name} (${e.uid})`).join("\n");

        const body =
`╭━「 ✅ 」
┃📍 DEV Members
┃👥 Total: ${config.DEV.length}
┃🧸 Status: Active
╰━━━━━━━━━━━━━╮
${memberList || "┃👤 No DEV added yet!"}
╰━━━━━━━━━━━━━╯
╭─❍ 𝐁𝐨𝐭 𝐁𝐲: 𝐆𝐨𝐣𝐨 𝐎𝐫𝐮𝐩𝐞 𝐏𝐢𝐰 𝐏𝐢𝐰
┃🌐 FB: https://www.facebook.com/100051168244116
╰━━━━━━━━━━━━━╯`;

        return message.reply(body);
      }

      default:
        return message.reply("⚠ | Use: div add/remove/list ...");
    }
  }
};
