const axios = require('axios');

module.exports = {
    name: 'ytdl',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download YouTube videos or audio',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a YouTube URL.\nUsage: .ytdl [url] [video/audio]\nExample: .ytdl https://youtu.be/... video' 
            });
        }
        
        const url = args[0];
        const type = args[1]?.toLowerCase() || 'video';
        
        let apiUrl;
        if (type === 'audio') {
            apiUrl = `https://apiskeith.top/download/yta?url=${encodeURIComponent(url)}`;
        } else {
            apiUrl = `https://apiskeith.top/download/ytv?url=${encodeURIComponent(url)}`;
        }
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: `⏳ Downloading YouTube ${type}...` });
            const response = await axios.get(apiUrl);
            if (response.data.status) {
                const result = response.data.result;
                let infoText = `🎬 *ATLAS-MB YOUTUBE DOWNLOAD*\n━━━━━━━━━━━━━━━━\n`;
                if (result.title) infoText += `📝 *Title:* ${result.title}\n`;
                if (result.duration) infoText += `⏱️ *Duration:* ${result.duration}\n`;
                infoText += `\n✅ *Download Link:* ${result.downloadUrl || result.url}\n`;
                
                await socket.sendMessage(msg.key.remoteJid, { text: infoText });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download YouTube content.' });
            }
        } catch (error) {
            console.error('YouTube download error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download from YouTube.' });
        }
    }
};