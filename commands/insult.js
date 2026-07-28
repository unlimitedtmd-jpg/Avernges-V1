const axios = require('axios');

module.exports = {
    name: 'insult',
    category: '𝐅𝐔𝐍 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get a random insult (use with caution!)',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/fun/insult');
            if (response.data.status) {
                await socket.sendMessage(msg.key.remoteJid, { 
                    text: `😤 *Insult:*\n${response.data.result}`
                });
            } else {
                // Handle specific error message from API
                const errorMsg = response.data.error || 'API returned false';
                await socket.sendMessage(msg.key.remoteJid, { 
                    text: `⚠️ ${errorMsg}`
                });
            }
        } catch (error) {
            console.error('Insult command error:', error);
            await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Failed to fetch insult. The server might be busy. Please try again later.' 
            });
        }
    }
};