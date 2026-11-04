# NEON BOT — WhatsApp Menu Bot

Bot menu WhatsApp berbasis Node.js + Baileys. Menu memakai simbol teks dekoratif, tanpa emoji.

## Persyaratan
- Node.js 20 atau lebih baru
- WhatsApp di ponsel untuk menautkan perangkat
- Koneksi internet stabil

## Instalasi di komputer / VPS
1. Ekstrak ZIP ini.
2. Buka terminal di folder `whatsapp-bot-racikan`.
3. Jalankan `npm install`.
4. Salin `.env.example` menjadi `.env`.
5. Isi `OWNER_NUMBER` dengan nomor Anda dalam format internasional tanpa tanda `+`, misalnya `6281234567890`.
6. Jalankan `npm start`.
7. Pindai QR yang muncul melalui WhatsApp > Perangkat tertaut > Tautkan perangkat.

## Perintah
Kirim `.menu` atau `menu` untuk melihat daftar.
- `.ping`, `.runtime`, `.owner`, `.about`
- `.waktu`
- `.say teks`
- `.kalkulator 12*(4+3)`
- `.groupinfo`, `.tagall`, `.hidetag` (grup)

## Menjalankan 24/7
Jalankan pada VPS/server yang selalu aktif. Simpan folder `auth_info` dengan aman. Jangan bagikan folder itu karena berisi sesi login WhatsApp.

## Catatan penting
- Ini memakai koneksi WhatsApp Web tidak resmi melalui Baileys, bukan WhatsApp Cloud API resmi. Otomasi pihak ketiga dapat berisiko menyebabkan pembatasan atau pemblokiran akun. Gunakan akun uji dan patuhi ketentuan WhatsApp.
- Jangan gunakan untuk spam, mengirim pesan massal tanpa izin, mengambil data pribadi, atau mengganggu pengguna.
- Untuk layanan bisnis/produksi, pertimbangkan WhatsApp Business Platform (Cloud API) resmi dari Meta.
- Bot tidak dapat dipasang otomatis ke ponsel dari sini. Anda perlu menjalankan proyek di komputer/VPS dan memindai QR sendiri.
