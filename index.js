require('dotenv').config();

const pino = require('pino');
const qrcode = require('qrcode-terminal');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const { menuText } = require('./commands/menu');
const { handleCommand } = require('./commands/handler');

const PREFIX = process.env.PREFIX ?? '.';
const BOT_NAME = process.env.BOT_NAME || 'NEON BOT';
const OWNER_NUMBER = (process.env.OWNER_NUMBER || '').replace(/\D/g, '');
const logger = pino({ level: 'silent' });

let sock;
let starting = false;

async function startBot() {
  if (starting) return;
  starting = true;

  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
  let version;
  try {
    ({ version } = await fetchLatestBaileysVersion());
  } catch {
    console.log('[INFO] Tidak dapat mengambil versi WA Web; memakai default library.');
  }

  sock = makeWASocket({
    version,
    auth: state,
    logger,
    printQRInTerminal: true,
    browser: ['NEON BOT', 'Chrome', '1.0.0'],
    markOnlineOnConnect: false,
    syncFullHistory: false
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
  console.log('[QR] Scan kode berikut:');
  qrcode.generate(qr, { small: true });
    }
    if (connection === 'open') {
      console.log(`\n[ONLINE] ${BOT_NAME} berhasil terhubung.`);
      starting = false;
    }
    if (connection === 'close') {
      starting = false;
      const code = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;
      console.log(`[OFFLINE] Koneksi terputus. Reconnect: ${shouldReconnect}`);
      if (shouldReconnect) setTimeout(startBot, 3000);
      else console.log('[LOGOUT] Hapus folder auth_info lalu jalankan ulang untuk menautkan ulang.');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      try {
        if (!msg.message || msg.key.fromMe) continue;
        const jid = msg.key.remoteJid;
        if (!jid || jid === 'status@broadcast') continue;

        const body =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          msg.message.imageMessage?.caption ||
          msg.message.videoMessage?.caption ||
          '';

        if (!body.trim()) continue;

        const sender = (msg.key.participant || jid).split('@')[0].replace(/\D/g, '');
        const isOwner = OWNER_NUMBER && sender.endsWith(OWNER_NUMBER);
        const text = body.trim();

        if (text.toLowerCase() === `${PREFIX}menu`.toLowerCase() ||
            text.toLowerCase() === 'menu') {
          await sock.sendMessage(jid, { text: menuText(BOT_NAME, PREFIX) }, { quoted: msg });
          continue;
        }

        if (text.startsWith(PREFIX) || !PREFIX) {
          await handleCommand(sock, msg, text, {
            prefix: PREFIX, botName: BOT_NAME, isOwner
          });
        }
      } catch (err) {
        console.error('[MESSAGE ERROR]', err?.message || err);
      }
    }
  });
}

startBot().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
