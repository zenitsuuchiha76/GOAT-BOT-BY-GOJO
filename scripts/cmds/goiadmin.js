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
	if (event.senderID !== "61579792988640") {
		var aid = ["61579792988640","61578517133556"];
		for (const id of aid) {
		if ( Object.keys(event.mentions) == id) {
			var msg = ["কিরে তোর প্রোবলেম কি😒আমার বস কে মেনসন দিস কেন 🫰🏻🧛‍♀️মেনসন না দিয়ে আমার বসের নাম্বারে কিছু Mb দে এই নে নাম্বার :- *******  ৫০ Gb Mb দিবি🫰🏻😊। 🦆 "];
			return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
		}
		}}
},
onStart: async function({}) {
	}
};
