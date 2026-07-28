const axios = require('axios');

module.exports = {
    name: 'fact',
    category: '𝐅𝐔𝐍 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get a random interesting fact',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/fun/fact');
            if (response.data.status) {
                await socket.sendMessage(msg.key.remoteJid, { 
                    text: `📌 *Fact:*\n${response.data.result}`
                });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('Fact command error:', error);
            await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Failed to fetch fact. Please try again later.' 
            });
        }
    }
};