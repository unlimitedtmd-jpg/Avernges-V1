const axios = require('axios');

module.exports = {
    name: 'mp4dl',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download video as MP4',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a video URL.\nUsage: .mp4dl [url]\nExample: .mp4dl https://example.com/video.mp4' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Processing MP4 download...' });
            const response = await axios.get(`https://apiskeith.top/download/mp4?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                await socket.sendMessage(msg.key.remoteJid, { text: `✅ *MP4 Download:*\n${result.downloadUrl || result.url}` });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to process MP4.' });
            }
        } catch (error) {
            console.error('MP4 download error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download MP4.' });
        }
    }
};