const axios = require('axios');

module.exports = {
    name: 'tiktokdl',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download TikTok videos without watermark',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a TikTok video URL.\nUsage: .tiktokdl [url]\nExample: .tiktokdl https://www.tiktok.com/@user/video/...' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Downloading TikTok video...' });
            const response = await axios.get(`https://apiskeith.top/download/tiktokdl3?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                let infoText = `🎵 *ATLAS-MB TIKTOK DOWNLOAD*\n━━━━━━━━━━━━━━━━\n`;
                if (result.title) infoText += `📝 *Title:* ${result.title}\n`;
                if (result.author) infoText += `👤 *Author:* ${result.author}\n`;
                infoText += `\n✅ *Download (No Watermark):* ${result.downloadUrl || result.url}\n`;
                
                await socket.sendMessage(msg.key.remoteJid, { text: infoText });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download TikTok video.' });
            }
        } catch (error) {
            console.error('TikTok download error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download TikTok video.' });
        }
    }
};