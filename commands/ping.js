const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'ping',
    description: 'Check bot latency',
    async execute(socket, msg, number, userConfig, loadUserConfigFromMongo, activeSockets, socketCreationTime) {
        const sanitized = (number || '').replace(/[^0-9]/g, '');
        const cfg = await loadUserConfigFromMongo(sanitized) || {};
        const botName = cfg.botName || 'ATLAS-MB彡';

        const latency = Date.now() - (msg.messageTimestamp * 1000 || Date.now());

        const text = `⚡ *${botName} • LIVE PING CHECK*

╭─╣
> 📶 *Latency*        : ${latency} ms
> 🕒 *Server Time*    : ${new Date().toLocaleString()}
> 🟢 *Active Sessions*: ${activeSockets.size}
╰─╣⁠

😌 _Response delivered before you even blinked._`;

        const fakevcard = {
            key: {
                remoteJid: "status@broadcast",
                participant: "0@s.whatsapp.net",
                fromMe: false,
                id: "META_AI_FAKE_ID"
            },
            message: {
                contactMessage: {
                    displayName: "ATLAS-MB彡",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:ATLAS;;;;\nFN:ATLAS-MB彡\nORG:ATLAS-MB彡\nTEL;type=CELL;type=VOICE;waid=13135550002:+1 313 555 0002\nEND:VCARD`
                }
            }
        };

        await socket.sendMessage(msg.key.remoteJid, {
            text: text,
            contextInfo: {
                externalAdReply: {
                    title: `${botName} - Latency Check`,
                    body: `Speed: ${latency}ms`,
                    thumbnailUrl: cfg.logo || 'https://files.catbox.moe/dtmruu.jpeg',
                    sourceUrl: "https://chat.whatsapp.com/FA1GPSjfUQLCyFbquWnRIS",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: fakevcard });
    }
};
