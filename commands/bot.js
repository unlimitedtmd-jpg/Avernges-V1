module.exports = {
    name: 'bot',
    async execute(socket, msg, number, userConfig, loadUserConfigFromMongo) {
        const sanitized = (number || '').replace(/[^0-9]/g, '');
        const cfg = await loadUserConfigFromMongo(sanitized) || {};
        const botName = cfg.botName || 'AVERNGES-V1彡';

        const statusText = `─╣ ⚠️ AVERNGES • MINI • BOT ⚠️ ╠⁠┈

╭─╣
┋  🟢 SYSTEM IS ACTIVE
╰─╣⁠

⚡ STATUS   : ONLINE
🤖 BOT      : AVERNGES-V1彡
👑 OWNER    : TIMNASAX
🧠 MEMORY  : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB

━━━━━━━━━━━━━━━━
🗺️ AVERNGES-MINI-BOT 🗺️`;

        await socket.sendMessage(msg.key.remoteJid, {
            text: statusText,
            contextInfo: {
                externalAdReply: {
                    title: `${botName} is Active`,
                    body: "System: Operational",
                    thumbnailUrl: cfg.logo || 'https://files.catbox.moe/dtmruu.jpeg',
                    sourceUrl: "https://avernges-v1.vercel.app/",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: msg });
    }
};
