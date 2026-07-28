const axios = require('axios');

module.exports = {
    name: 'tt',
    async execute(socket, msg, number, userConfig, loadUserConfigFromMongo, activeSockets, socketCreationTime) {
        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        const args = text.split(' ');
        const url = args[1];

        if (!url || !url.includes("tiktok.com")) {
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
            
            return socket.sendMessage(msg.key.remoteJid, { 
                text: "Give me a valid TikTok link, you absolute potato." 
            }, { quoted: fakevcard });
        }

        const sanitized = (number || '').replace(/[^0-9]/g, '');
        const cfg = await loadUserConfigFromMongo(sanitized) || {};

        try {
            const { data } = await axios.get(`https://api.nekolabs.web.id/downloader/tiktok`, {
                params: { url: url }
            });

            const fakevcard = {
                key: {
                    remoteJid: "status@broadcast",
                    participant: "0@s.whatsapp.net",
                    fromMe: false,
                    id: "META_AI_FAKE_ID"
                },
                message: {
                    contactMessage: {
                        displayName: "Toxic-Mini-Bot",
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Fredi;;;;\nFN:Toxic-Mini-Bot\nORG:Toxic Bot\nTEL;type=CELL;type=VOICE;waid=13135550002:+1 313 555 0002\nEND:VCARD`
                    }
                }
            };

            const botName = cfg.botName || 'ATLAS-MB彡';
            const caption = `📥 *TIKTOK VIDEO DOWNLOADED*

╭─╣〔 🎵 ATLAS-MB彡 • TIKTOK ╠⁠┈┈
┃
┃ 👤 *Author*   : ${data.result.author?.name || 'Unknown'}
┃ ⏱️ *Duration* : ${data.result.duration || 'N/A'}
┃ 🎞️ *Quality*  : HD
┃
╰─╣⁠

✨ *Downloaded successfully by* ${botName}`;

            await socket.sendMessage(msg.key.remoteJid, {
                video: { url: data.result.videoUrl },
                caption: caption,
                contextInfo: {
                    externalAdReply: {
                        title: `${botName} | TikTok Downloader`,
                        body: "Video Saved Successfully",
                        thumbnailUrl: cfg.logo || 'https://files.catbox.moe/dtmruu.jpeg',
                        sourceUrl: "https://chat.whatsapp.com/FA1GPSjfUQLCyFbquWnRIS",
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: fakevcard });

        } catch (error) {
            console.error('TikTok Error:', error);
            
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
                text: "TikTok download failed. Link might be broken or private." 
            }, { quoted: fakevcard });
        }
    }
};
