module.exports = {
    name: 'script',
    async execute(socket, msg) {
        const text = ` SCRIPT-BOT REPOSITORY 

╭─╣ SYSTEM INFORMATION ╠⁠┈┈
│ 👤 Owner   : Dml
│ 🔗 Repo    : https://atlas-mb.vercel.app
│ 🌐 Access  : Public Only
╰─╣⁠

⚡ Powered by FrediEzraツ    
`;

        await socket.sendMessage(msg.key.remoteJid, {
            text: text,
            contextInfo: {
                externalAdReply: {
                    title: "Atlas Mb Official",
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
