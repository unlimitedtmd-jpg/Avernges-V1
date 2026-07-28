const axios = require('axios');

module.exports = {
    name: 'mp3dl',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download audio as MP3',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide an audio URL.\nUsage: .mp3dl [url]\nExample: .mp3dl https://example.com/audio.mp3' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Processing MP3 download...' });
            const response = await axios.get(`https://apiskeith.top/download/mp3?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                await socket.sendMessage(msg.key.remoteJid, { text: `✅ *MP3 Download:*\n${result.downloadUrl || result.url}` });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to process MP3.' });
            }
        } catch (error) {
            console.error('MP3 download error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download MP3.' });
        }
    }
};