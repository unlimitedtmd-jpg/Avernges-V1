const axios = require('axios');

module.exports = {
    name: 'ytv4',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download YouTube video (version 4)',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a YouTube URL.\nUsage: .ytv4 [url]\nExample: .ytv4 https://youtu.be/...' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Downloading video...' });
            const response = await axios.get(`https://apiskeith.top/download/ytv4?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                await socket.sendMessage(msg.key.remoteJid, { text: `✅ *Download Link:*\n${result.downloadUrl || result.url}` });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download video.' });
            }
        } catch (error) {
            console.error('YouTube V4 error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download video.' });
        }
    }
};