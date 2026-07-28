const axios = require('axios');

module.exports = {
    name: 'pinterestdl',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download from Pinterest',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a Pinterest URL.\nUsage: .pinterestdl [url]\nExample: .pinterestdl https://pin.it/...' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Downloading from Pinterest...' });
            const response = await axios.get(`https://apiskeith.top/download/pinterest?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                let infoText = `📌 *ATLAS-MB PINTEREST DOWNLOAD*\n━━━━━━━━━━━━━━━━\n`;
                if (result.title) infoText += `📝 *Title:* ${result.title}\n`;
                if (result.creator) infoText += `👤 *Creator:* ${result.creator}\n`;
                infoText += `\n✅ *Download Link:* ${result.downloadUrl || result.url}\n`;
                
                await socket.sendMessage(msg.key.remoteJid, { text: infoText });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download from Pinterest.' });
            }
        } catch (error) {
            console.error('Pinterest download error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download from Pinterest.' });
        }
    }
};