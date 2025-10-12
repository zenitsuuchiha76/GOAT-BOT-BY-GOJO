const axios = require("axios");

module.exports = {
  config: {
    name: "sim",
    aliases: [],
    version: "1.1.0",
    author: "SaGor",
    countDown: 2,
    role: 0,
    shortDescription: "Full Simsimi API command",
    longDescription: "Teach, edit, delete, list, info, ans, count — all in one",
    category: "admin",
    guide: { en: "sim [text|teach|edit|delete|delans|list|info|ans|count]" }
  },

  onStart: async function ({ message, event, args }) {
    const { senderID } = event;
    const subcmd = args[0];
    const DELETE_KEY = "11sagorislam";

    const API_GITHUB_URL = "https://raw.githubusercontent.com/SAGOR-KINGx/SaGor/refs/heads/main/api.json";
    const ADMIN_GITHUB_URL = "https://raw.githubusercontent.com/SAGOR-KINGx/SaGor/refs/heads/main/simadmin.json";
    const NOPERM_GITHUB_URL = "https://raw.githubusercontent.com/SAGOR-KINGx/SaGor/refs/heads/main/simtxt.json";

    try {
      const [apiRes, adminRes, noPermRes] = await Promise.all([
        axios.get(API_GITHUB_URL),
        axios.get(ADMIN_GITHUB_URL),
        axios.get(NOPERM_GITHUB_URL)
      ]);

      const API_BASE = apiRes.data.api;
      const ADMINS = adminRes.data.admins || [];
      const NO_PERMISSION_MSG = Array.isArray(noPermRes.data.message) && noPermRes.data.message.length > 0
        ? noPermRes.data.message[Math.floor(Math.random() * noPermRes.data.message.length)]
        : null;

      if (!ADMINS.includes(senderID.toString())) {
        if (NO_PERMISSION_MSG) return message.reply(NO_PERMISSION_MSG);
        return;
      }

      if (!subcmd) {
        return message.reply(
          "📘 Usage:\n" +
          "• sim text Question\n" +
          "• sim teach Question | Answer\n" +
          "• sim edit Question | NewAnswer\n" +
          "• sim delete Question\n" +
          "• sim delans Question | AnswerToDelete\n" +
          "• sim list\n" +
          "• sim info Question\n" +
          "• sim ans AnswerText\n" +
          "• sim count"
        );
      }

      if (subcmd === "text") {
        const question = args.slice(1).join(" ");
        if (!question) return message.reply("❌ Format: sim text Question");
        const res = await axios.get(`${API_BASE}/sim?text=${encodeURIComponent(question)}`);
        return message.reply(res.data.answer || "⚠️ No answer found");
      }

      if (subcmd === "teach") {
        const raw = args.slice(1).join(" ");
        if (!raw.includes("|")) return message.reply("❌ Format: sim teach Question | Answer");
        const [question, answer] = raw.split("|").map(s => s.trim());
        await axios.get(`${API_BASE}/sim?teach=${encodeURIComponent(question)}|${encodeURIComponent(answer)}`);
        return message.reply(`✅ Added:\n❓ Q: ${question}\n💡 A: ${answer}`);
      }

      if (subcmd === "edit") {
        const raw = args.slice(1).join(" ");
        if (!raw.includes("|")) return message.reply("❌ Format: sim edit Question | NewAnswer");
        const [question, newAnswer] = raw.split("|").map(s => s.trim());
        await axios.get(`${API_BASE}/sim?edit=${encodeURIComponent(question)}|${encodeURIComponent(newAnswer)}`);
        return message.reply(`✏️ Edited:\n❓ Q: ${question}\n💡 New A: ${newAnswer}`);
      }

      if (subcmd === "delete") {
        const question = args.slice(1).join(" ").trim();
        if (!question) return message.reply("❌ Format: sim delete Question");
        await axios.get(`${API_BASE}/sim?delete=${encodeURIComponent(question)}&key=${DELETE_KEY}`);
        return message.reply(`🗑 Deleted Question:\n❓ ${question}`);
      }

      if (subcmd === "delans") {
        const raw = args.slice(1).join(" ");
        if (!raw.includes("|")) return message.reply("❌ Format: sim delans Question | AnswerToDelete");
        const [question, answerToDelete] = raw.split("|").map(s => s.trim());
        await axios.get(`${API_BASE}/sim?delete=${encodeURIComponent(question)}&answer=${encodeURIComponent(answerToDelete)}&key=${DELETE_KEY}`);
        return message.reply(`🗑 Deleted Answer:\n❓ ${question}\n💡 Removed: ${answerToDelete}`);
      }

      if (subcmd === "list") {
        const res = await axios.get(`${API_BASE}/sim?list`);
        const list = res.data.data;
        const totalAsk = res.data.totalAsk || 0;
        const totalAnswer = res.data.totalAnswer || 0;
        if (!Array.isArray(list) || list.length === 0) return message.reply("📃 No data available.");
        let msg = "📚 Simsimi Question List\n━━━━━━━━━━━━━━\n\n";
        list.forEach((item, i) => msg += `${i + 1}. ❓ ${item.question} (${item.answerCount} answers)\n`);
        msg += `\n━━━━━━━━━━━━━━\n📊 Total Questions: ${totalAsk}\n💡 Total Answers: ${totalAnswer}`;
        return message.reply(msg);
      }

      if (subcmd === "info") {
        const question = args.slice(1).join(" ").trim();
        if (!question) return message.reply("❌ Format: sim info Question");
        const res = await axios.get(`${API_BASE}/sim?info=${encodeURIComponent(question)}`);
        if (res.data.error) return message.reply(res.data.error);
        const answers = res.data.answers || [];
        let msg = `❓ Question: ${res.data.question}\n💡 Total Answers: ${answers.length}\n`;
        answers.forEach(ans => msg += `   ${ans}\n`);
        return message.reply(msg);
      }

      if (subcmd === "ans") {
        const answerText = args.slice(1).join(" ").trim();
        if (!answerText) return message.reply("❌ Format: sim ans AnswerText");
        const res = await axios.get(`${API_BASE}/sim?ans=${encodeURIComponent(answerText)}`);
        if (res.data.error) return message.reply(res.data.error);
        let msg = `💡 Answer: ${answerText}\n❓ Total Questions: ${res.data.questionCount}\n`;
        res.data.questions.forEach(q => msg += `   ${q}\n`);
        return message.reply(msg);
      }

      if (subcmd === "count") {
        const res = await axios.get(`${API_BASE}/sim/count`);
        const { totalAsk, totalAnswer } = res.data;
        return message.reply(`📊 Ask Count: ${totalAsk}\n💡 Answer Count: ${totalAnswer}`);
      }

      return message.reply("❌ Unknown sub-command!");
    } catch (err) {
      console.error(err);
      return message.reply("❌ API Error: " + err.message);
    }
  }
};
