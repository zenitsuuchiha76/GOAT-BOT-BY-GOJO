module.exports = {
	config: {
		name: "goiadmin",
		author: "SaGor",
		role: 0,
		shortDescription: " ",
		longDescription: "",
		category: "BOT",
		guide: "{pn}"
	},

	onChat: function({ api, event }) {
		if (event.senderID !== "100051168244116") {
			var aid = ["100051168244116"];
			for (const id of aid) {
				if (Object.keys(event.mentions) == id) {
					var msg = [
						"⚠️ Gojo Orupe Piw Piw বস এখন খুব ব্যস্ত, পরে মিনশন দিয়েন!",
						"😼  গোজু অরুপে পিউ পিউ বস এখন ফ্রি না, আমাকে বলুন কী দরকার?",
						"🙄 এতবার মিনশন দিয়া লাভ নাই, ইনবক্স করুন।",
						"😒 মিনশন না দিয়ে এক গ্লাস পানি খেয়ে আসেন!",
						"🤫 GOJO ORUPE PIW PIW বস এখন গভীর চিন্তায়, দয়া করে বিরক্ত করবেন না!",
						"📵 ভাইরে ভাই, মিনশন দিলে নোটিফিকেশন ভাইঙ্গা পড়ে!",
						"😂 GOJO ORUPE PIW PIW বস তো তোর গার্ডিয়ান না, ক্যান এত চিন্তা করস?",
						"🥱 বস তো ঘুমায়া পড়ছে, এখন ডাক দিয়া লাভ নাই!",
						"😤 এতবার মিনশন দিয়া লাভ নাই, উনি তো বিজি ইন লাভ!",
						"🕵️‍♂️ GOJO ORUPE PIW PIW বস এর খোঁজ রাখার জন্য তোমাকে পুরস্কার দেওয়া উচিত!"
					];
					
					return api.sendMessage(
						{ body: msg[Math.floor(Math.random() * msg.length)] },
						event.threadID,
						event.messageID
					);
				}
			}
		}
	},

	onStart: async function({}) {}
};
