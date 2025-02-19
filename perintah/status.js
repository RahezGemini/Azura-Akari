module.exports = {
  hady: { 
    nama: "status", 
    penulis: "Hady Zen", 
    kuldown: 10,
    peran: 0,
    tutor: ""
  }, 
  
  Ayanokoji: async function ({ api, event, getData }) {
    const { nama, userID, level, exp, dollar } = getData(event.senderID);
    api.sendMessage(` 𝗦𝘁𝗮𝘁𝘂𝘀\n\nNama: ${nama}\nID: ${userID}\ndollar: ${dollar}¥\nLevel: ${level}`, event.threadID, event.messageID);
  }
};
