const axios = require('axios');

module.exports = {
    name: 'truth',
    category: '𝐅𝐔𝐍 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get a random truth question',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/fun/truth');
            if (response.data.status) {
                await socket.sendMessage(msg.key.remoteJid, { 
                    text: `📖 *Truth:*\n${response.data.result}`
                });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('Truth command error:', error);
            await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Failed to fetch truth. Please try again later.' 
            });
        }
    }
};