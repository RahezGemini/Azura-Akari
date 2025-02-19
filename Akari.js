const express = require('express');
const app = express();
const login = require('./deshboard/ayanokoji');
const { logo, warna, font, ayanokoji } = require('./deshboard/log');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cron = require('node-cron');
const { spawn } = require('child_process');
const akun = fs.readFileSync('account.txt', 'utf8');
const { version } = require('./package');
const gradient = require('gradient-string');
const { awalan, nama, admin, proxy, port, bahasa: nakano, maintain, chatdm, notifkey, aikey, setting, zonawaktu, database } = require('./kiyotaka');
const { kuldown } = require('./deshboard/kuldown');
const moment = require('moment-timezone');
const now = moment.tz(zonawaktu);
const userID = event.senderID;
process.on('unhandledRejection', error => console.log(logo.error + error));
process.on('uncaughtException', error => console.log(logo.error + error));
const zen = { host: proxy, port: port };
const kiyopon = gradient("#ADD8E6", "#4682B4", "#00008B")(logo.ayanokoji);
const tanggal = now.format('YYYY-MM-DD');
const waktu = now.format('HH:mm:ss');
const web = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
global.Ayanokoji = { awalan: awalan, nama: nama, admin: admin, logo: logo, aikey: aikey, bahasa: nakano, web: web, maintain: maintain, waktu: waktu, tanggal: tanggal };

async function notiferr(notif) { 
  try { 
    const oreki = `⚡ 𝗔𝗱𝗮 𝗘𝗿𝗿𝗼𝗿\n\n𝖯𝗋𝗈𝗃𝖾𝗄: ${nama}\n𝖤𝗋𝗋𝗈𝗋: ${notif}`;
    const { data } = await axios.get(`https://api.callmebot.com/facebook/send.php?apikey=${notifkey}&text=${encodeURIComponent(oreki)}`);
  } catch (futaro) {
    console.log(logo.error + 'Terjadi kesalahan pada notif' + futaro);
  }
};

async function getStream(hadi, isekai) {
  try {
    const kiyotaka = await axios.get(hadi, { responseType: 'arraybuffer' });
    const otaku = Buffer.from(kiyotaka.data, 'binary');
    const wibu = path.join(__dirname, 'deshboard', isekai);
    fs.writeFileSync(wibu, otaku);
    return wibu;
  } catch (error) {
    throw error;
  }
};

let data = {};
if (fs.existsSync(path.join('bot', 'db.json'))) {
  data = JSON.parse(fs.readFileSync(path.join('bot', 'db.jsom'), 'utf-8'));
}

function addData(id) {
  if (data[id]) {
  } else {
    data[id] = { "nama": "Facebook User", "userID": userID, "dollar": 0, "exp": 0, "level": 1, "daily": null };
    console.log(ayanokoji('database') + `${id} pengguna baru.`);
  }
  simpan();
};

function setUser(id, item, baru) {
  if (item == "nama" || item == "daily") {
    data[id][item] = baru;
    simpan();
    console.log(ayanokoji('database') + 'Pembaruan berhasil.');
  } else if (item == "dollar" || item == "exp" || item == "level") {
    if (typeof baru === 'number') {
      data[id][item] = baru;
      simpan();    
      console.log(ayanokoji('database') + 'Pembaruan berhasil.');
    } else {
      console.log(ayanokoji('database') + 'Nilai untuk ' + item + ' harus berupa angka.');
    }
  }
};

function getData(id) {
  return data[id] || data;
};

function simpan() {
  fs.writeFile(path.join('bot', 'db.json'), JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.log(logo.error + "Terjadi kesalahan pada db: ", err);
    } else { }
  });
};

async function loadC() {
  fs.readFileSync('kiyotaka.json')
};

console.log(kiyopon);
setInterval(function() { loadC(); }, 1000);
cron.schedule('0 */4 * * *', () => {
  console.clear();
  process.exit();
  const child = spawn("refresh", {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });
  child.on('error', (err) => {
    console.log(logo.error + 'Ada error pada autorest: ', err);
  });
  child.on('exit', (code) => {
    if (code === 0) {
      console.log(ayanokoji('restar') + nama + ' berhasil dimulai ulang.');
    } else {
      console.log(logo.error + nama + ' gagal dimulai ulang: ', code);
    }
  });
});
console.log(ayanokoji('versi') + `${version}.`);
console.log(ayanokoji('awalan') + `${awalan}`);
console.log(ayanokoji('bahasa') + `${nakano}.`);
console.log(ayanokoji('database') + `Tersambung ke database ${database}`)
console.log(ayanokoji('admin') + `${admin}.`);
console.log(ayanokoji('webview') + `${web}.`);
fs.readdir('./perintah', (err, files) => { 
  const shadow = files.map(file => path.parse(file).name);
  console.log(ayanokoji('perintah') + `${shadow}.`);
});

if (!akun || akun.length < 0 || !JSON.parse(akun)) {
  console.log(logo.error + 'Kamu belum memasukkan cookie.');
  process.exit();
}

login({appState: JSON.parse(akun, zen)}, setting, (err, api) => {
  if (err) { 
    notiferr(`Terjadi kesalahan saat login: ${err.message || err.error}`);
    console.log(logo.error + `Terjadi kesalahan saat login: ${err.message || err.error}`);
    process.exit();
  }
      
  api.listenMqtt((err, event) => {
    if (err) {
      notiferr(`${err.message || err.error}`);
      console.log(logo.error + `${err.message || err.error}`);
      process.exit();
    }
    const body = event.body;
    if (!body || global.Ayanokoji.maintain === true && !admin.includes(event.senderID) || chatdm === false && event.isGroup == false && !admin.includes(event.senderID)) return; 
    addData(event.senderID);
    if (body.toLowerCase() == "prefix") return api.sendMessage(` Awalan ${nama}: ${awalan}`, event.threadID, event.messageID);
if (body.trim() === awalan) {
      return api.sendMessage(`Halo Gunakan ${awalan}menu untuk melihat daftar perintah`, event.threadID, event.messageID);
    }
    const cmd = body.slice(awalan.length).trim().split(/ +/g).shift().toLowerCase();
	   
    async function hady_cmd(cmd, api, event) {
      const pipi = body?.replace(`${awalan}${cmd}`, "")?.trim();
      const args = pipi?.split(' ');

      try {
        const skibidi = await new Promise((resolve, reject) => { api.getThreadInfo(event.threadID, (err, info) => { if (err) reject(err); else resolve(info); }); });
        const fitri = skibidi.adminIDs.map(admin => admin.id);
        const files = fs.readdirSync(path.join(__dirname, '/perintah'));
        let commandFound = false;
        for (const file of files) {
          if (file.endsWith('.js')) {
            const anime = path.join(path.join(__dirname, '/perintah'), file);
            const { hady, Ayanokoji, bahasa } = require(anime);
            

            if (hady && hady.nama === cmd && typeof Ayanokoji === 'function') {
                commandFound = true;
              console.log(logo.cmds + `Menjalankan perintah ${hady.nama}.`);
              const bhs = function(veng) { return bahasa[nakano][veng]; };	
   
              if (kuldown(event.senderID, hady.nama, hady.kuldown) == 'hadi') { 
                if (hady.peran == 0 || !hady.peran) {
                  await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData });
                  return;
                }
                if ((hady.peran == 2 || hady.peran == 1) && admin.includes(event.senderID) || hady.peran == 0) {
                  await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData });
                  return;
                } else if (hady.peran == 1 && fitri.join(', ').includes(event.senderID) || hady.peran == 0) {
                  await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData });
                  return;
                } else { 
                  api.setMessageReaction("❗", event.messageID);
                }
              } else {
                api.setMessageReaction('⌛', event.messageID);
              }
            } 
          }
          if(!commandFound) {
            return api.sendMessage(`Perintah ${cmd} Tidak di Temukan`)
          }
        }
      } catch (error) {
        notiferr(`Perintah error: ${error.message}`);
        console.log(logo.error + 'Perintah error: ' + error.message);
      }
    }
    hady_cmd(cmd, api, event);
  });
});

app.listen(port, () => { 
  console.log(`Server berjalan di port ${port}`);
});


app.get('/keep-alive', (req, res) => {
  res.send('Server is alive');
});


app.get('/status', (req, res) => {
  const status = `status: Server Ok`;
  res.json({ status, web });
});


app.get('/feedback', (req, res) => { 
  res.sendFile(path.join(__dirname, 'deshboard', 'html', 'feedback.html'));
});

app.get('/social', (req, res) => { 
  res.sendFile(path.join(__dirname, 'deshboard', 'html', 'social.html'));
});

app.get('/gemini', async (req, res) => {
  const text = req.query.pesan || 'hai';

  try {
    const data = {
      contents: [{ parts: [{ text: text }] }]
    };
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${aikey}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const answer = response.data.candidates[0].content.parts[0].text;
    res.json({ pembuat: "Google Gemini", answer });
  } catch (error) {
    res.json({ error: 'Maaf ada kesalahan: ' + error.message });
  }
});


app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'deshboard', 'html', '404.html'));
});


setInterval(() => {
  axios.get(`${web}/keep-alive`)
    .then(response => {
      console.log('Keep-alive response:', response.data);
    })
    .catch(error => {
      console.error('Error keeping server alive:', error);
    });
}, 5 * 60 * 1000);
