const axios = require('axios');

module.exports = {
    name: 'gpt',
    async execute(socket, msg, number, userConfig, loadUserConfigFromMongo, activeSockets, socketCreationTime) {
        const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        const prompt = text.split(' ').slice(1).join(' ').trim();

        if (!prompt) {
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
                text: "Where is your prompt? You managed to type the command but forgot the question. Amazing." 
            }, { quoted: fakevcard });
        }

        const sanitized = (number || '').replace(/[^0-9]/g, '');
        const cfg = await loadUserConfigFromMongo(sanitized) || {};

        try {
            const apiUrl = `https://api.deline.web.id/ai/openai`;
            
            const { data } = await axios.get(apiUrl, {
                params: {
                    text: prompt,
                    prompt: "You are ATLAS-MB彡 AI 𝗖𝗿𝗲𝗮𝘁𝗲𝗱 𝗯𝘆 𝗗𝗺𝗹 and your replies must always be ATLAS-MB彡"
                }
            });

            if (!data.status || !data.result) {
                throw new Error('API returned garbage');
            }

            const botName = cfg.botName || 'ATLAS-MB彡';

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

            const messageText = `*『���-��𝙏-4 �������� 』*\n\n${data.result}\n\n—\n${botName} • GPT-4O`;

            await socket.sendMessage(msg.key.remoteJid, {
                text: messageText,
                contextInfo: {
                    externalAdReply: {
                        title: `${botName} | ATLAS-MB彡 AI`,
                        body: "Created by FrediEzraツ",
                        thumbnailUrl: cfg.logo || 'https://files.catbox.moe/dtmruu.jpeg',
                        sourceUrl: "https://chat.whatsapp.com/FA1GPSjfUQLCyFbquWnRIS",
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: fakevcard });

        } catch (error) {
            console.error('GPT Error:', error);
            
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
                text: "AI failed. Maybe your question was too stupid even for AI." 
            }, { quoted: fakevcard });
        }
    }
};