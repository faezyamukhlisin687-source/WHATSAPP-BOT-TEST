const os = require('os');
const { menuText } = require('./menu');

const startedAt = Date.now();

function uptime() {
  const s = Math.floor((Date.now() - startedAt) / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}j ${m}m ${sec}d`;
}

async function handleCommand(sock, msg, raw, ctx) {
  const { prefix, botName, isOwner } = ctx;
  const jid = msg.key.remoteJid;
  const text = raw.trim();
  const commandText = prefix && text.startsWith(prefix) ? text.slice(prefix.length) : text;
  const [command, ...args] = commandText.trim().split(/\s+/);
  const cmd = (command || '').toLowerCase();
  const argText = args.join(' ');

  const reply = (value) => sock.sendMessage(jid, { text: value }, { quoted: msg });

  switch (cmd) {
    case 'menu':
      return reply(menuText(botName, prefix));
    case 'ping':
      return reply('╭─〔 PING 〕\n│ Status : ONLINE\n│ Latency: ' + (Date.now() - (msg.messageTimestamp * 1000 || Date.now())) + ' ms\n╰────────');
    case 'runtime':
      return reply('╭─〔 RUNTIME 〕\n│ Aktif : ' + uptime() + '\n│ RAM   : ' + Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB\n│ Host  : ' + os.platform() + '\n╰────────');
    case 'owner':
      return reply('╭─〔 OWNER 〕\n│ Nomor owner diatur melalui OWNER_NUMBER pada file .env.\n╰────────');
    case 'about':
      return reply('╭─〔 ABOUT 〕\n│ ' + botName + '\n│ Bot menu WhatsApp berbasis Node.js.\n│ Gunakan secara wajar dan patuhi aturan WhatsApp.\n╰────────');
    case 'waktu': {
      const now = new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'full', timeStyle: 'long',
        timeZone: process.env.TIMEZONE || 'Asia/Jakarta'
      }).format(new Date());
      return reply('╭─〔 WAKTU 〕\n│ ' + now + '\n╰────────');
    }
    case 'say':
      return reply(argText || 'Format: ' + prefix + 'say <teks>');
    case 'kalkulator': {
      if (!argText || !/^[\d+\-*/().\s%]+$/.test(argText)) {
        return reply('Format: ' + prefix + 'kalkulator 12*(4+3)');
      }
      try {
        // Hanya karakter matematika yang diizinkan; tidak menerima identifier atau kode.
        const result = Function('"use strict"; return (' + argText + ')')();
        if (!Number.isFinite(result)) throw new Error('Hasil tidak valid');
        return reply('╭─〔 KALKULATOR 〕\n│ ' + argText + ' = ' + result + '\n╰────────');
      } catch {
        return reply('Perhitungan tidak valid.');
      }
    }
    case 'groupinfo': {
      if (!jid.endsWith('@g.us')) return reply('Perintah ini hanya untuk grup.');
      const meta = await sock.groupMetadata(jid);
      return reply('╭─〔 GROUP INFO 〕\n│ Nama   : ' + meta.subject + '\n│ Peserta: ' + meta.participants.length + '\n│ ID     : ' + jid + '\n╰────────');
    }
    case 'tagall':
    case 'hidetag': {
      if (!jid.endsWith('@g.us')) return reply('Perintah ini hanya untuk grup.');
      const meta = await sock.groupMetadata(jid);
      const mentions = meta.participants.map(p => p.id);
      const body = argText || 'Perhatian seluruh anggota grup.';
      return sock.sendMessage(jid, { text: body, mentions }, { quoted: msg });
    }
    case 'broadcast':
      if (!isOwner) return reply('Akses ditolak: khusus owner.');
      return reply('Fitur broadcast massal sengaja tidak diaktifkan untuk mencegah spam. Kirim pengumuman langsung ke grup yang relevan.');
    default:
      return reply('Perintah tidak dikenal. Ketik ' + (prefix || '') + 'menu untuk melihat daftar menu.');
  }
}

module.exports = { handleCommand };
