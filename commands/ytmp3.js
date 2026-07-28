const axios = require('axios');

module.exports = {
    name: 'ytmp3',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Convert YouTube to MP3',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a YouTube URL.\nUsage: .ytmp3 [url]\nExample: .ytmp3 https://youtu.be/...' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Converting to MP3...' });
            const response = await axios.get(`https://apiskeith.top/download/ytmp3?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                await socket.sendMessage(msg.key.remoteJid, { text: `✅ *MP3 Download:*\n${result.downloadUrl || result.url}` });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to convert.' });
            }
        } catch (error) {
            console.error('YTMP3 error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to convert YouTube to MP3.' });
        }
    }
};