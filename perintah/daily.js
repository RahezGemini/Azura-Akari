module.exports = {
  hady: { 
    nama: "daily", 
    penulis: "Hady Zen", 
    kuldown: 10,
    peran: 0,
    tutor: ""
  }, 
  
  Ayanokoji: async function ({ api, event, getData, setUser }) {
  const { dollar, exp, daily } = getData(event.senderID);
    if (daily == null || daily !== global.Ayanokoji.tanggal) { 
  setUser(event.senderID, 'dollar', dollar + 2000);
  setUser(event.senderID, 'exp', exp + 1000);
  setUser(event.senderID, 'daily', global.Ayanokoji.tanggal);
    api.sendMessage("Kamu berhasil mengklaim 2000 dollar dan 1000 exp", event.threadID, event.messageID);
    } else {
    api.sendMessage('Kamu sudah mengklaim hadiah harian.', event.threadID, event.messageID);
  }
 }
};
