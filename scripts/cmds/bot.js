const axios = require("axios");

const BOT_REPLIES = ["<মাঝে মাঝে ফ-র্সা লাগে চিরদিন কেন লাগে না!🙂","< কেউ আমাকে বুঝে না..!🙂\nMaybe আমি অংক..🤷‍♀️","< ৫ টাকা ভাড়া বাঁচাতে গিয়ে ২৫ টাকার কোল্ড ড্রিংকস খেয়ে হেটে হেটে আসা মধ্যবিত্ত আমি.!🙂","জীবনে এতো মু র গী খাইছি যে এখন নিজেকে শি য়া ল মনে হচ্ছে!🙂","বন্ধুদের বিয়েতে গিয়ে স্ট্যাটাস দেবো বন্ধুর বিপদের দিনে পাশে আছি","ভাল্লুকের গল্পে যে বন্ধুটা গাছে উঠেছিল ওর আসলে  প্রকৃত বন্ধু হওয়ার জন্যে কি করা উচিত ছিলো?🙄","মাঝে মাঝে ধন্যবাদ দিয়ে মা!নুষকে ছোট করে দিতে ইচ্ছে করে.!🤗","একই গাড়িতে আত্নীয় উঠলে। বড্ড টে-ন-শ-নে থাকি! ভাড়া টা আমি দিবো নাকি উনি...!🐸"];
const API_CONFIG_URL = "https://raw.githubusercontent.com/SAGOR-KINGx/SaGor/refs/heads/main/api.json";

async function getApiBase() {
  try {
    const res = await axios.get(API_CONFIG_URL);
    return res.data.api;
  } catch {
    return null;
  }
}

module.exports = {
  config: {
    name: "bot",
    version: "9.0.0",
    author: "SaGor",
    role: 0,
    category: "auto",
    prefix: false,
    shortDescription: "Bot with teach system + trigger chat + reply continuation"
  },

  onStart: async () => {
    console.log("✅ 'bot' command loaded (trigger + teach + reply system active)");
  },

  teach: async function (apiUrl, ask, ans) {
    try {
      const res = await axios.get(`${apiUrl}/sim`, { params: { teach: `${ask}|${ans}` } });
      return res.data;
    } catch (err) {
      console.error("❌ Teach Error:", err.message);
      return null;
    }
  },

  onChat: async function ({ api, event, message }) {
    try {
      const { body, messageReply } = event;
      if (!body) return;

      const text = body.trim().toLowerCase();
      const botID = await api.getCurrentUserID();
      const API_BASE = await getApiBase();
      if (!API_BASE) return message.reply("⚠️ API link not found (GitHub JSON load failed)");

      if (messageReply && text.startsWith("teach ")) {
        const ask = text.slice(6).trim();
        const ans = messageReply.body?.trim();
        if (!ans) return message.reply("❌ Reply to a message to teach its content!");
        const result = await this.teach(API_BASE, ask, ans);
        return message.reply(result?.success
          ? `✅ Teach Added!\n💬 ASK: ${ask}\n💡 ANS: ${ans}`
          : `⚠️ Teach failed! ${result?.error || ""}`);
      }

      if (text.startsWith("teach ")) {
        const input = text.slice(6).trim();
        const [ask, ans] = input.split(/[\|\-]/).map(x => x?.trim());
        if (ask && ans) {
          const result = await this.teach(API_BASE, ask, ans);
          return message.reply(result?.success
            ? `✅ Teach Added!\n💬 ASK: ${ask}\n💡 ANS: ${ans}`
            : `⚠️ Teach failed! ${result?.error || ""}`);
        }
      }

      const triggerWords = ["baby", "bby", "bot", "বেবি", "সাগর", "বট","sagor"];
      const startsWithTrigger = triggerWords.some(w => text.startsWith(w));

      if (startsWithTrigger) {
        const userText = text.replace(/^\S+\s*/, "");

        if (!userText) {
          const randomReply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
          return api.sendMessage(randomReply, event.threadID, (error, info) => {
            if (!info) return;
            global.GoatBot.onReply.set(info.messageID, {
              commandName: "bot",
              type: "reply",
              messageID: info.messageID,
              author: event.senderID
            });
          }, event.messageID);
        }

        const response = await axios.get(`${API_BASE}/sim`, { params: { text: userText } });
        const reply = response.data.answer || "🤖 Couldn't get a reply right now.";
        return api.sendMessage(reply, event.threadID, (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "bot",
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            reply
          });
        }, event.messageID);
      }
    } catch (err) {
      console.error("❌ Chatbot Error:", err.message);
      return message.reply("❌ Error: " + err.message);
    }
  },

  onReply: async function ({ api, event }) {
    try {
      const botID = await api.getCurrentUserID();
      if (botID === event.senderID) return;

      if (event.type === "message_reply") {
        const API_BASE = await getApiBase();
        if (!API_BASE) return api.sendMessage("⚠️ API not found!", event.threadID);
        const response = await axios.get(`${API_BASE}/sim`, { params: { text: event.body?.toLowerCase() } });
        const reply = response.data.answer || "🤖 Couldn't get a reply right now.";
        await api.sendMessage(reply, event.threadID, (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "bot",
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            reply
          });
        }, event.messageID);
      }
    } catch (err) {
      return api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
  }
};
