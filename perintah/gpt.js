const axios = require("axios");

module.exports = {
  hady: {
    nama: "gpt", 
    kuldown: 6,
    peran: 0,
    penulis: "Rahez", 
    tutor: "<answer>"
  },
  
  
  Ayanokoji: async function ({ api, event, args }) {
    if (!args.join(' ')) return api.sendMessage('Masukan prompt nya', event.threadID, event.messageID);

    
    try {
      const respon = await axios.get(`https://api.ryzendesu.vip/api/ai/v2/chatgpt?text=${encodeURIComponent(args.join(' '))}`)
        const response = respon.data.response;
        api.sendMessage(response, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error contacting AI:", error);
      api.sendMessage("Gagal Mengirim Request.", event.threadID, event.messageID);
    }
  }
};