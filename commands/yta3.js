const axios = require('axios');

module.exports = {
    name: 'yta3',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download YouTube audio (version 3)',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a YouTube URL.\nUsage: .yta3 [url]\nExample: .yta3 https://youtu.be/...' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Downloading audio...' });
            const response = await axios.get(`https://apiskeith.top/download/yta3?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                await socket.sendMessage(msg.key.remoteJid, { text: `✅ *Download Link:*\n${result.downloadUrl || result.url}` });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download audio.' });
            }
        } catch (error) {
            console.error('YouTube A3 error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download audio.' });
        }
    }
};