const axios = require('axios');

module.exports = {
    name: 'ig',
    async execute(socket, msg, number, userConfig, loadUserConfigFromMongo, activeSockets, socketCreationTime) {
        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        const args = text.split(' ');
        const url = args[1];

        if (!url || !url.includes("instagram.com")) {
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
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:ATLAS-MB彡;;;;\nFN:ATLAS-MB彡\nORG:ATLAS-MB彡 Bot\nTEL;type=CELL;type=VOICE;waid=13135550002:+1 313 555 0002\nEND:VCARD`
                    }
                }
            };
            
            return socket.sendMessage(msg.key.remoteJid, { 
                text: "Link is missing or garbage. Give me a proper Instagram link." 
            }, { quoted: fakevcard });
        }

        const sanitized = (number || '').replace(/[^0-9]/g, '');
        const cfg = await loadUserConfigFromMongo(sanitized) || {};

        try {
            const { data } = await axios.get(`https://api.fikmydomainsz.xyz/download/instagram`, {
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
                        displayName: "ATLAS-MB彡",
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:ATLAS-MB彡;;;;\nFN:ATLAS-MB彡\nORG:ATLAS-MB彡 Bot\nTEL;type=CELL;type=VOICE;waid=13135550002:+1 313 555 0002\nEND:VCARD`
                    }
                }
            };

            const botName = cfg.botName || 'ATLAS-MB彡';
            const videoUrl = data.result?.[0]?.url_download;

            if (!videoUrl) {
                throw new Error('No video URL found');
            }

            const caption = `

╭─╣ MEDIA DETAILS ╠⁠┈┈
│ 📸 Platform : Instagram
│ 🎞 Quality  : High
│ ✅ Status   : Downloaded
╰─╣⁠

⬇️ Delivered by ${botName}
`;

            await socket.sendMessage(msg.key.remoteJid, {
                video: { url: videoUrl },
                caption: caption,
                contextInfo: {
                    externalAdReply: {
                        title: `${botName} | Instagram Downloader`,
                        body: "Media Saved Successfully",
                        thumbnailUrl: cfg.logo || 'https://files.catbox.moe/dtmruu.jpeg',
                        sourceUrl: "https://chat.whatsapp.com/FA1GPSjfUQLCyFbquWnRIS",
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: fakevcard });

        } catch (error) {
            console.error('Instagram Error:', error);
            
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
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:ATLAS-MB彡;;;;\nFN:ATLAS-MB彡\nORG:ATLAS-MB彡 Bot\nTEL;type=CELL;type=VOICE;waid=13135550002:+1 313 555 0002\nEND:VCARD`
                    }
                }
            };
            
            await socket.sendMessage(msg.key.remoteJid, { 
                text: "Instagram service failed. Link might be private or broken." 
            }, { quoted: fakevcard });
        }
    }
};