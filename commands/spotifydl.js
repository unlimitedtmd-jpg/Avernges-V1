const axios = require('axios');

module.exports = {
    name: 'spotifydl',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download from Spotify',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a Spotify track URL.\nUsage: .spotifydl [url]\nExample: .spotifydl https://open.spotify.com/track/...' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Processing Spotify track...' });
            const response = await axios.get(`https://apiskeith.top/download/spotify?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                let infoText = `🎧 *ATLAS-MB SPOTIFY DOWNLOAD*\n━━━━━━━━━━━━━━━━\n`;
                if (result.title) infoText += `📝 *Title:* ${result.title}\n`;
                if (result.artist) infoText += `🎤 *Artist:* ${result.artist}\n`;
                infoText += `\n✅ *Download Link:* ${result.downloadUrl || result.url}\n`;
                
                await socket.sendMessage(msg.key.remoteJid, { text: infoText });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to process Spotify track.' });
            }
        } catch (error) {
            console.error('Spotify download error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download from Spotify.' });
        }
    }
};