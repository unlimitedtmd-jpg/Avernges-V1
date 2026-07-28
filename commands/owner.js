module.exports = {
    name: 'owner',
    description: 'Show owner info',
    async execute(socket, msg, number) {
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
                    vcard: `BEGIN:VCARD
VERSION:3.0
N:ATLAS-MB彡;;;;
FN:ATLAS-MB彡
ORG:ATLAS-MB彡 Bot
TEL;type=CELL;type=VOICE;waid=13135550002:+1 313 555 0002
END:VCARD`
                }
            }
        };

        const text = `*👑 𝐎𝐖𝐍𝐄𝐑 𝐈𝐍𝐅𝐎 👑*

╭─╣    \`𝐎𝐰𝐧𝐞𝐫 𝐃𝐞𝐭𝐚𝐢𝐥𝐬\`    ╠⁠┈┈
> ┈┈╣⁠ 👑 INFO 👑 ╠⁠┈┈
> \`👤\` 𝐍𝐚𝐦𝐞 : Fredi_Ezraツ
> \`👤\` 𝐍𝐮𝐦𝐛𝐞𝐫 : +255752593977
> \`👤\` 𝐑𝐨𝐥𝐞  : 𝐁𝐨𝐭 𝐂𝐫𝐞𝐚𝐭𝐨𝐫
╰─╣⁠
*Contact for support*`;

        const buttons = [
            { buttonId: `${global.config.PREFIX || '.'}menu`, buttonText: { displayText: "📜 ᴍᴇɴᴜ" }, type: 1 },
        ];

        await socket.sendMessage(msg.key.remoteJid, {
            text,
            footer: "👑 𝘖𝘸𝘯𝘦𝘳 𝘐𝘯𝘧𝘰𝘳𝘮𝘢𝘵𝘪𝘰𝘯",
            buttons
        }, { quoted: fakevcard });
    }
};