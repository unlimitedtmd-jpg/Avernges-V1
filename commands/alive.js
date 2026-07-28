module.exports = {
    name: 'alive',
    async execute(socket, msg, number, userConfig, loadUserConfigFromMongo) {
        const sanitized = (number || '').replace(/[^0-9]/g, '');
        const cfg = await loadUserConfigFromMongo(sanitized) || {};
        const botName = cfg.botName || 'ATLAS-MB彡';

        const statusText = `

╭─╣ SYSTEM ACTIVE ╠⁠┈┈
│ ⚡ Status     : ONLINE
│ 🤖 Bot Name   : ${botName}
│ 👑 Owner      : Fredi
│ 🧠 Memory     : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
╰─╣⁠

✔ All systems operational
✔ Monitoring enabled
`;

        await socket.sendMessage(msg.key.remoteJid, {
            text: statusText,
            contextInfo: {
                externalAdReply: {
                    title: `${botName} is Active`,
                    body: "System: Operational",
                    thumbnailUrl: cfg.logo || 'https://files.catbox.moe/dtmruu.jpeg',
                    sourceUrl: "https://atlas-mb.vercel.app",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: msg });
    }
};
