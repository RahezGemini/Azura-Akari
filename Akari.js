const express = require('express');
const app = express();
const login = require('./hady-zen/ayanokoji');
const { logo, warna, font, ayanokoji } = require('./hady-zen/log');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cron = require('node-cron');
const { spawn } = require('child_process');
const { version } = require('./package');
const gradient = require('gradient-string');
const { awalan, nama, admin, proxy, port, bahasa: nakano, maintain, chatdm, notifkey, aikey, setting, zonawaktu, database } = require('./kiyotaka');
const { kuldown } = require('./hady-zen/kuldown');
const moment = require('moment-timezone');
const now = moment.tz(zonawaktu);

process.on('unhandledRejection', error => console.log(logo.error + error));
process.on('uncaughtException', error => console.log(logo.error + error));

const zen = { host: proxy, port: port };
const kiyopon = gradient("#ADD8E6", "#4682B4", "#00008B")(logo.ayanokoji);
const tanggal = now.format('YYYY-MM-DD');
const waktu = now.format('HH:mm:ss');
const web = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
global.Ayanokoji = { awalan, nama, admin, logo, aikey, bahasa: nakano, web, maintain, waktu, tanggal };

async function notiferr(notif) {
  try {
    const oreki = `⚡ 𝗔𝗱𝗮 𝗘𝗿𝗿𝗼𝗿\n\n𝖯𝗋𝗈𝗃𝖾𝖼𝗍: ${nama}\n𝖤𝗋𝗋𝗈𝗋: ${notif}`;
    await axios.get(`https://api.callmebot.com/facebook/send.php?apikey=${notifkey}&text=${encodeURIComponent(oreki)}`);
  } catch (error) {
    console.log(logo.error + 'Terjadi kesalahan pada notif', error);
  }
}

async function getStream(url, filename) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const filePath = path.join(__dirname, 'hady-zen', filename);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (error) {
    throw error;
  }
}

let data = {};
const dbPath = path.join('bot', 'user.db');
if (fs.existsSync(dbPath)) {
  data = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

let threadData = {};
const threadDbPath = path.join('bot', 'thread.db');
if (fs.existsSync(threadDbPath)) {
  threadData = JSON.parse(fs.readFileSync(threadDbPath, 'utf-8'));
}

function addData(id) {
  if (!data[id]) {
    data[id] = { 'nama': 'Facebook User', 'userID': id, 'dollar': 0, 'exp': 0, 'level': 1, 'daily': null };
    console.log(ayanokoji('database') + `${id} pengguna baru.`);
    simpan();
  }
}

function setUser(id, item, value) {
  if (['nama', 'daily'].includes(item)) {
    data[id][item] = value;
  } else if (['dollar', 'exp', 'level'].includes(item)) {
    if (typeof value === 'number') {
      data[id][item] = value;
    } else {
      console.log(ayanokoji('database') + 'Nilai untuk ' + item + ' harus berupa angka.');
      return;
    }
  }
  simpan();
  console.log(ayanokoji('database') + 'Pembaruan berhasil.');
}

function getData(id) {
  return data[id] || data;
}

function simpan() {
  fs.writeFile(dbPath, JSON.stringify(data, null, 2), err => {
    if (err) console.log(logo.error + "Terjadi kesalahan pada db: ", err);
  });
}

function saveThreadData(threadID, threadInfo) {
  threadData[threadID] = threadInfo;
  fs.writeFile(threadDbPath, JSON.stringify(threadData, null, 2), err => {
    if (err) console.log(logo.error + "Terjadi kesalahan pada thread db: ", err);
  });
}

function ThreadData(threadID) {
  return threadData[threadID] || null;
}

function loadC() {
  fs.readFileSync('kiyotaka.json');
}

console.log(kiyopon);
setInterval(loadC, 1000);

cron.schedule('0 */4 * * *', () => {
  console.clear();
  process.exit();
  const child = spawn("refresh", { cwd: __dirname, stdio: "inherit", shell: true });
  child.on('error', err => console.log(logo.error + 'Ada error pada autorest: ', err));
  child.on('exit', code => {
    if (code === 0) console.log(ayanokoji('restar') + nama + ' berhasil dimulai ulang.');
    else console.log(logo.error + nama + ' gagal dimulai ulang: ', code);
  });
});

console.log(ayanokoji('versi') + `${version}.`);
console.log(ayanokoji('awalan') + `${awalan}`);
console.log(ayanokoji('bahasa') + `${nakano}.`);
console.log(ayanokoji('database') + `Tersambung ke database ${database}`);
console.log(ayanokoji('admin') + `${admin}.`);
console.log(ayanokoji('webview') + `${web}.`);

fs.readdir('./perintah', (err, files) => {
  const commands = files.map(file => path.parse(file).name);
  console.log(ayanokoji('perintah') + `${commands}.`);
});

const akun = fs.readFileSync('account.txt', 'utf8');
if (!akun || akun.length < 0 || !JSON.parse(akun)) {
  console.log(logo.error + 'Kamu belum memasukkan cookie.');
  process.exit();
}

login({ appState: JSON.parse(akun, zen) }, setting, (err, api) => {
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
    if (!body || (global.Ayanokoji.maintain === true && !admin.includes(event.senderID)) || (chatdm === false && event.isGroup == false && !admin.includes(event.senderID))) return;

    addData(event.senderID);
    if (body.toLowerCase() == "prefix") return api.sendMessage(` Awalan ${nama}: ${awalan}`, event.threadID, event.messageID);
    if (body.trim() === awalan) return api.sendMessage(`Halo Gunakan ${awalan}menu untuk melihat daftar perintah`, event.threadID, event.messageID);

    const cmd = body.slice(awalan.length).trim().split(/ +/g).shift().toLowerCase();

    async function hady_cmd(cmd, api, event) {
      const args = body?.replace(`${awalan}${cmd}`, "")?.trim().split(' ');

      try {
        const threadInfo = await new Promise((resolve, reject) => {
          api.getThreadInfo(event.threadID, (err, info) => {
            if (err) reject(err);
            else resolve(info);
          });
        });

        saveThreadData(event.threadID, threadInfo);

        const adminIDs = threadInfo.adminIDs.map(admin => admin.id);
        const files = fs.readdirSync(path.join(__dirname, '/perintah'));
        let commandFound = false;

        for (const file of files) {
          if (file.endsWith('.js')) {
            const commandPath = path.join(path.join(__dirname, '/perintah'), file);
            const { hady, Ayanokoji, bahasa } = require(commandPath);

            if (hady && hady.nama === cmd && typeof Ayanokoji === 'function') {
              commandFound = true;
              console.log(logo.cmds + `Menjalankan perintah ${hady.nama}.`);
              const bhs = veng => bahasa[nakano][veng];

              if (kuldown(event.senderID, hady.nama, hady.kuldown) == 'hadi') {
                if (hady.peran == 0 || !hady.peran) {
                  await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData, ThreadData });
                  return;
                }
                if ((hady.peran == 2 || hady.peran == 1) && admin.includes(event.senderID) || hady.peran == 0) {
                  await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData, ThreadData });
                  return;
                } else if (hady.peran == 1 && adminIDs.includes(event.senderID) || hady.peran == 0) {
                  await Ayanokoji({ api, event, args, bhs, getStream, loadC, setUser, getData, ThreadData });
                  return;
                } else {
                  api.setMessageReaction("❗", event.messageID);
                }
              } else {
                api.setMessageReaction('⌛', event.messageID);
              }
            }
          }
        }

        if (!commandFound) {
          return api.sendMessage(`Perintah ${cmd} Tidak di Temukan`);
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

app.get('/feedback', (req, res) => {
  res.sendFile(path.join(__dirname, 'hady-zen', 'html', 'feedback.html'));
});

app.get('/social', (req, res) => {
  res.sendFile(path.join(__dirname, 'hady-zen', 'html', 'social.html'));
});

app.get('/gemini', async (req, res) => {
  const text = req.query.pesan || 'hai';

  try {
    const data = { contents: [{ parts: [{ text }] }] };
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${aikey}`, data, {
      headers: { 'Content-Type': 'application/json' }
    });
    const answer = response.data.candidates[0].content.parts[0].text;
    res.json({ pembuat: "Google Gemini", answer });
  } catch (error) {
    res.json({ error: 'Maaf ada kesalahan: ' + error.message });
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'hady-zen', 'html', '404.html'));
});