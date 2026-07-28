const axios = require('axios');

module.exports = {
    name: 'fbdl',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download Facebook videos',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a Facebook video URL.\nUsage: .fbdl [url]\nExample: .fbdl https://web.facebook.com/.../videos/...' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Downloading Facebook video...' });
            const response = await axios.get(`https://apiskeith.top/download/fbdl?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                let infoText = `📘 *ATLAS-MB FACEBOOK VIDEO*\n━━━━━━━━━━━━━━━━\n`;
                if (result.title) infoText += `📝 *Title:* ${result.title}\n`;
                infoText += `\n✅ *Download Link:* ${result.downloadUrl || result.url}\n`;
                
                await socket.sendMessage(msg.key.remoteJid, { text: infoText });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: `❌ ${response.data.err || 'Invalid Facebook URL'}` });
            }
        } catch (error) {
            console.error('Facebook download error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download Facebook video.' });
        }
    }
};