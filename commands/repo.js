module.exports = {
    name: 'repo',
    async execute(socket, msg) {
        const text = `╭─╣ ATLAS-MB彡 ╠⁠┈┈


👑 Owner    : Fredi
🌍 Website  : https://atlas-mb.vercel.app
✅ Status   : Public Only

Built and powered by FrediEzraツ
`;
https://minbot.dml-tech.online
        await socket.sendMessage(msg.key.remoteJid, {
            text: text,
            contextInfo: {
                externalAdReply: {
                    title: "Atlas Mini Bot Official",
                    body: "Get the latest updates here",
                    thumbnailUrl: 'https://files.catbox.moe/dtmruu.jpeg',
                    sourceUrl: "https://atlas-mb.vercel.app",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: msg });
    }
};
