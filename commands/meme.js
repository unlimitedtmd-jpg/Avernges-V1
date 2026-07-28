const axios = require('axios');

module.exports = {
    name: 'meme',
    category: '𝐅𝐔𝐍 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get a random meme from Reddit',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/fun/meme');
            if (response.data.status) {
                const meme = response.data;
                const caption = `🎭 *Meme*\n\n📝 *Title:* ${meme.title}\n👤 *Author:* ${meme.author}\n👍 *Ups:* ${meme.ups}\n🔗 *Reddit:* ${meme.postLink}`;
                
                await socket.sendMessage(msg.key.remoteJid, {
                    image: { url: meme.url },
                    caption: caption
                });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('Meme command error:', error);
            await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Failed to fetch meme. Please try again later.' 
            });
        }
    }
};