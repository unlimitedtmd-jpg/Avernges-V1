const axios = require('axios');

module.exports = {
    name: 'soundcloud',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download from SoundCloud',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a SoundCloud URL.\nUsage: .soundcloud [url]\nExample: .soundcloud https://soundcloud.com/...' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Processing SoundCloud track...' });
            const response = await axios.get(`https://apiskeith.top/download/soundcloud?url=${encodeURIComponent(url)}`);
            if (response.data.status && response.data.result) {
                const track = response.data.result;
                let infoText = `🎵 *ATLAS-MB SOUNDCLOUD DOWNLOAD*\n━━━━━━━━━━━━━━━━\n`;
                if (track.title) infoText += `📝 *Title:* ${track.title}\n`;
                if (track.artist) infoText += `🎤 *Artist:* ${track.artist}\n`;
                if (track.duration) infoText += `⏱️ *Duration:* ${track.duration}\n`;
                if (track.downloadUrl) infoText += `\n✅ *Download:* ${track.downloadUrl}\n`;
                
                await socket.sendMessage(msg.key.remoteJid, { text: infoText });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to process SoundCloud URL. The API might be temporarily unavailable.' });
            }
        } catch (error) {
            console.error('SoundCloud error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ SoundCloud service is currently unavailable. Please try again later.' });
        }
    }
};