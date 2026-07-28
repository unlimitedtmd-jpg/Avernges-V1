const axios = require('axios');

module.exports = {
    name: 'video',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Universal video downloader',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a video URL.\nUsage: .videodl [url]\nExample: .videodl https://example.com/video' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Downloading video...' });
            const response = await axios.get(`https://apiskeith.top/download/video?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                await socket.sendMessage(msg.key.remoteJid, { text: `✅ *Video Download:*\n${result.downloadUrl || result.url}` });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download video.' });
            }
        } catch (error) {
            console.error('Video download error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download video.' });
        }
    }
};