module.exports = {
  hady: {
    nama: "eval", 
    kuldown: 6,
    peran: 2,
    penulis: "Rahez", 
    tutor: "<code>"
  },
  
  
  Ayanokoji: async function ({ api, event, args }) {
function output(msg) {
      if (typeof msg === "number" || typeof msg === "boolean" || typeof msg === "function") {
        msg = msg.toString();
      } else if (msg instanceof Map) {
        let text = `Map(${msg.size}) `;
        text += JSON.stringify(mapToObj(msg), null, 2);
        msg = text;
      } else if (typeof msg === "object") {
        msg = JSON.stringify(msg, null, 2);
      } else if (typeof msg === "undefined") {
        msg = "undefined";
      }
      api.sendMessage(msg, event.threadID, event.messageID);
    }
    function out(msg) {
      output(msg);
    }
    function mapToObj(map) {
      const obj = {};
      map.forEach(function (v, k) {
        obj[k] = v;
      });
      return obj;
    }
    const code = args.join(" ");
    if (!code) return api.sendMessage("❌ Format perintah salah! Gunakan: /eval <kode yang ingin dijalankan>", event.threadID, event.messageID);
    try {
      await eval(code); 
    } catch (err) {
      api.sendMessage(`❌ Terjadi kesalahan:\n${err.message}`, event.threadID, event.messageID);
    }
  }
};