const moment = require('moment-timezone');
const axios = require('axios');

module.exports = {
  config: {
    name: "info",
    aliases: ["inf", "in4"],
    version: "3.7",
    author: "SaGor",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Shows bot and owner info with photo."
    },
    longDescription: {
      en: "Displays detailed information about the bot and owner, including uptime, ping, social links, and local time, with a profile photo."
    },
    category: "Information",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    this.sendInfo(message);
  },

  onChat: async function ({ event, message }) {
    if (event.body && event.body.toLowerCase() === "info") {
      this.sendInfo(message);
    }
  },

  sendInfo: async function (message) {
    const botName = "𝗣𝗶𝘄 𝗣𝗶𝘄 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁";
    const ownerName = "𝗚𝗢𝗝𝗢 𝗢𝗥𝗨𝗣𝗘 𝗣𝗜𝗪 𝗣𝗜𝗪";
    const moderatedBy = "𝗚𝗢𝗝𝗢 𝗫 𝗭𝗘𝗡𝗜𝗧𝗦𝗨";
    const religion = "𝗜𝗦𝗟𝗔𝗠";
    const botStatus = "𝗦𝗜𝗡𝗚𝗟𝗘";
    const address = "𝗗𝗛𝗔𝗞𝗔 , 𝗕𝗔𝗡𝗚𝗟𝗔𝗗𝗘𝗦𝗛";
    const userClass = "𝗦𝗘𝗖𝗥𝗘𝗧";
    const facebook = "https://www.facebook.com/100051168244116";
    const tiktok = "https://www.tiktok.com/𝗻𝗮𝗶.";

    const now = moment().tz('Asia/Dhaka');
    const localTime = now.format('hh:mm:ss A');

    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const uptimeString = `${hours}h ${minutes}m ${seconds}s`;

    const start = Date.now();
    await new Promise(resolve => setTimeout(resolve, 100));
    const ping = Date.now() - start;

    const photoUrl = "https://i.ibb.co.com/Mx2T8QPr/1761680512606-2.jpg";

    const body = `
╭─ <𝐎𝐖𝐍𝐄𝐑  𝐈𝐍𝐅𝐎> ─╮
├──────────────⍟
│ 👑 𝕆𝕎ℕ𝔼ℝ : ${ownerName}
│ ⚙️ 𝕄𝕆𝔻𝔼ℝ𝔸𝕋𝔼𝔻 𝔹𝕐 : ${moderatedBy}
│ 🏫 ℂ𝕃𝔸𝕊𝕊 : ${userClass}
│ 🏠 𝔸𝔻𝔻ℝ𝔼𝕊𝕊 : ${address}
│ 🌍 ℝ𝔼𝕃𝕀𝔾𝕀𝕆ℕ : ${religion}
│ 🧬 𝕊𝕋𝔸𝕋𝕌𝕊 : ${botStatus}
│ 📘 𝔽𝔸ℂ𝔼𝔹𝕆𝕆𝕂 : ${facebook}
│ 📸 𝕋𝕀𝕂𝕋𝕆𝕂 : ${tiktok}
├───────────⍟
│
│𖣘 <𝐁𝐎𝐓  𝐈𝐍𝐅𝐎> 𖣘
├───────────⍟
│ 🤖 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞: ${botName}
│ 🕐 𝐓𝐢𝐦𝐞: ${localTime}
│ 🌀 𝐔𝐩𝐭𝐢𝐦𝐞: ${uptimeString}
│ ⚡ 𝐏𝐢𝐧𝐠: ${ping}𝐦𝐬
╰───────────╯
`;

    try {
      const response = await axios.get(photoUrl, { responseType: 'stream' });
      message.reply({ body, attachment: response.data });
    } catch {
      message.reply("⚠️ Failed to load photo.");
    }
  }
};
