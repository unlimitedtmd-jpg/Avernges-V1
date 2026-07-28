const axios = require('axios');

module.exports = {
    name: 'twitterdl',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download Twitter/X videos',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a Twitter/X video URL.\nUsage: .twitterdl [url]\nExample: .twitterdl https://twitter.com/.../status/...' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Downloading Twitter video...' });
            const response = await axios.get(`https://apiskeith.top/download/twitter?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                await socket.sendMessage(msg.key.remoteJid, { text: `✅ *Download Link:*\n${result.downloadUrl || result.url}` });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: `❌ ${response.data.result || 'Invalid Twitter URL'}` });
            }
        } catch (error) {
            console.error('Twitter download error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download Twitter video.' });
        }
    }
};