const axios = require('axios');

module.exports = {
    name: 'fb',
    async execute(socket, msg, number, userConfig, loadUserConfigFromMongo) {
        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        const args = text.trim().split(/\s+/);
        const url = args[1];

        const fakevcard = {
            key: { remoteJid: "status@broadcast", participant: "0@s.whatsapp.net", fromMe: false, id: "ATLAS-MB彡_FB_ID" },
            message: { contactMessage: { displayName: "ATLAS-MB彡", vcard: `BEGIN:VCARD\nVERSION:3.0\nN:ATLAS-MB彡;;;;\nFN:ATLAS-MB彡\nTEL;type=CELL;type=VOICE;waid=255752593977:+255 764 182 801\nEND:VCARD` } }
        };

        if (!url || (!url.includes("facebook.com") && !url.includes("fb.watch"))) {
            return socket.sendMessage(msg.key.remoteJid, { 
                text: "Give me a valid Facebook link, you absolute potato. I don't have all day." 
            }, { quoted: fakevcard });
        }

        const sanitized = (number || '').replace(/[^0-9]/g, '');
        const cfg = await loadUserConfigFromMongo(sanitized) || {};
        const botName = cfg.botName || 'ATLAS-MB彡';

        try {
            await socket.sendMessage(msg.key.remoteJid, { react: { text: '⌛', key: msg.key } });

            const { data } = await axios.get(`https://vinztyty.my.id/download/facebook`, {
                params: { url: url }
            });

            if (!data.status || !data.result || data.result.length === 0) {
                await socket.sendMessage(msg.key.remoteJid, { react: { text: '❌', key: msg.key } });
                return socket.sendMessage(msg.key.remoteJid, { text: "No video found. This link is as empty as your head." }, { quoted: fakevcard });
            }

            const videos = data.result;
            let videoToUse = videos.find(v => v.quality && v.quality.includes("720p")) || videos[0];

            if (!videoToUse || !videoToUse.url || videoToUse.url === "/") {
                throw new Error("Invalid URL returned");
            }

            const caption = `─╣⁠ FACEBOOK DOWNLOAD ╠⁠┈

╭─╣ VIDEO DETAILS ╠⁠┈┈
│ 📱 Platform : Facebook
│ 🎞️ Quality  : ${videoToUse.quality || 'HD'}
│ ✅ Status   : Download Complete
╰─╣⁠

📥 Processed by ${botName}
Enjoy your video!`;

            await socket.sendMessage(msg.key.remoteJid, { react: { text: '✅', key: msg.key } });

            await socket.sendMessage(msg.key.remoteJid, {
                video: { url: videoToUse.url },
                caption: caption,
                contextInfo: {
                    externalAdReply: {
                        title: `${botName} | FB Downloader`,
                        body: "Video Saved Successfully",
                        thumbnailUrl: cfg.logo || 'https://files.catbox.moe/dtmruu.jpeg',
                        sourceUrl: "https://chat.whatsapp.com/FA1GPSjfUQLCyFbquWnRIS",
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: fakevcard });

        } catch (error) {
            await socket.sendMessage(msg.key.remoteJid, { react: { text: '❌', key: msg.key } });
            await socket.sendMessage(msg.key.remoteJid, { 
                text: "Facebook download failed harder than your IQ. Try again or touch grass." 
            }, { quoted: fakevcard });
        }
    }
};
