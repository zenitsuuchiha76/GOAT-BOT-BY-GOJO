const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { URL } = require("url");
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "logs",
    version: "2.0",
    author: "SaGor",
    countDown: 5,
    role: 0,
    shortDescription: "Fetch API data and return as .txt file",
    longDescription: "Fetch detailed information from a URL or domain and send it as a clean .txt file.",
    category: "utility",
    guide: { en: "{pn} <url or domain>" }
  },

  onStart: async function ({ api, event, args, message }) {
    const { messageID } = event;

    if (!args[0]) {
      return message.reply(
        "⚠️ Please provide a valid URL or domain!\n\n🧭 Example:\n• logs example.com\n• logs https://example.com"
      );
    }

    const rawInput = args.join(" ").trim();
    const toUrl = (input) => {
      try {
        const formatted = input.match(/^https?:\/\//i) ? input : `https://${input}`;
        return new URL(formatted);
      } catch {
        return null;
      }
    };

    const parsed = toUrl(rawInput);
    if (!parsed) return message.reply(`❌ Invalid link format: ${rawInput}`);

    const safeHost = parsed.hostname.replace(/[^a-z0-9.-]/gi, "_");
    const fileName = `${safeHost}.txt`;
    const filePath = path.join(os.tmpdir(), fileName);

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      const endpoint = "http://menu.panelaimbot.com:4004/api/v1/search";
      const apiKey = "gDGDZy3lKhJwaXsb";

      const res = await axios.get(endpoint, {
        params: { q: rawInput },
        headers: { "X-API-Key": apiKey },
        timeout: 15000
      });

      let content;
      try {
        content = JSON.stringify(res.data, null, 2);
      } catch {
        content = String(res.data);
      }

      if (!content || content.length < 5) throw new Error("Empty or invalid API response");

      fs.writeFileSync(filePath, content, "utf8");

      const dhakaTime = moment().tz("Asia/Dhaka").format("YYYY-MM-DD HH:mm:ss");

      await message.reply({
        body: `✅ Data Fetch Complete!\n━━━━━━━━━━━━━━━━━━\n🌐 Website: ${parsed.hostname}\n📁 File: ${fileName}\n🕒 Time (Dhaka): ${dhakaTime}\n\n📄 The text file is attached below.`,
        attachment: fs.createReadStream(filePath)
      });

      api.setMessageReaction("✅", messageID, () => {}, true);

      setTimeout(() => { try { fs.unlinkSync(filePath); } catch {} }, 10000);
    } catch (err) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      message.reply(`❌ Failed to fetch data.\n━━━━━━━━━━━━━━━━━━\n💬 Error: ${err.message || "Unknown error"}\n⚙️ Please try again later.`);
    }
  }
};
