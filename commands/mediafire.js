const axios = require('axios');

module.exports = {
    name: 'mediafire',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download from MediaFire',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a MediaFire URL.\nUsage: .mediafire [url]\nExample: .mediafire https://www.mediafire.com/...' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Processing MediaFire link...' });
            const response = await axios.get(`https://apiskeith.top/download/mfire?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                let infoText = `📦 *ATLAS-MB MEDIAFIRE DOWNLOAD*\n━━━━━━━━━━━━━━━━\n`;
                if (result.filename) infoText += `📄 *File:* ${result.filename}\n`;
                if (result.size) infoText += `💾 *Size:* ${result.size}\n`;
                infoText += `\n✅ *Download Link:* ${result.downloadUrl || result.url}\n`;
                
                await socket.sendMessage(msg.key.remoteJid, { text: infoText });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: `❌ ${response.data.err || 'Invalid MediaFire URL'}` });
            }
        } catch (error) {
            console.error('MediaFire error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to process MediaFire link.' });
        }
    }
};