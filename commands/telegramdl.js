const axios = require('axios');

module.exports = {
    name: 'telegramdl',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download content from Telegram',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a Telegram URL.\nUsage: .telegram [url]\nExample: .telegram https://t.me/...' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Downloading from Telegram...' });
            const response = await axios.get(`https://apiskeith.top/download/telegram?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                if (result.downloadUrl) {
                    await socket.sendMessage(msg.key.remoteJid, { text: `✅ *Download Ready:*\n${result.downloadUrl}` });
                } else {
                    await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to get download URL.' });
                }
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: `❌ ${response.data.result || 'Invalid Telegram URL'}` });
            }
        } catch (error) {
            console.error('Telegram download error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download from Telegram. Please check the URL and try again.' });
        }
    }
};