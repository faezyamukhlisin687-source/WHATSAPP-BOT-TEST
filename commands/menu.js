function menuText(botName, prefix = '.') {
  const p = prefix || '';
  return [
    '╭━━━〔 ' + botName + ' 〕━━━╮',
    '┃',
    '┃  ◈ STATUS : ACTIVE',
    '┃  ◈ MODE   : WHATSAPP BOT',
    '┃  ◈ PREFIX : ' + (prefix || '(tanpa prefix)'),
    '┃',
    '┣━━〔 MENU UTAMA 〕',
    '┃  ▸ ' + p + 'menu',
    '┃  ▸ ' + p + 'ping',
    '┃  ▸ ' + p + 'runtime',
    '┃  ▸ ' + p + 'owner',
    '┃  ▸ ' + p + 'about',
    '┃',
    '┣━━〔 MENU GRUP 〕',
    '┃  ▸ ' + p + 'groupinfo',
    '┃  ▸ ' + p + 'tagall',
    '┃  ▸ ' + p + 'hidetag',
    '┃',
    '┣━━〔 MENU UTILITAS 〕',
    '┃  ▸ ' + p + ' waktu',
    '┃  ▸ ' + p + 'kalkulator <angka>',
    '┃  ▸ ' + p + 'say <teks>',
    '┃',
    '┣━━〔 MENU OWNER 〕',
    '┃  ▸ ' + p + 'broadcast <teks>  [owner]',
    '┃',
    '┣━━〔 PANDUAN 〕',
    '┃  ▸ Gunakan perintah sesuai format.',
    '┃  ▸ Beberapa fitur hanya aktif di grup.',
    '┃  ▸ Hindari spam dan pesan massal.',
    '┃',
    '╰━━━━━━━━━━━━━━━━━━╯',
    '「 ' + botName + ' • crafted with care 」'
  ].join('\n');
}

module.exports = { menuText };
