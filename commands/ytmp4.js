const axios = require('axios');

module.exports = {
    name: 'ytmp4',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Convert YouTube to MP4',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a YouTube URL.\nUsage: .ytmp4 [url]\nExample: .ytmp4 https://youtu.be/...' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Converting to MP4...' });
            const response = await axios.get(`https://apiskeith.top/download/ytmp4?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                await socket.sendMessage(msg.key.remoteJid, { text: `✅ *MP4 Download:*\n${result.downloadUrl || result.url}` });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to convert.' });
            }
        } catch (error) {
            console.error('YTMP4 error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to convert YouTube to MP4.' });
        }
    }
};