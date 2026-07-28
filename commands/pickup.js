const axios = require('axios');

module.exports = {
    name: 'pickup',
    category: '𝐅𝐔𝐍 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get a cheesy pickup line',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/fun/pickuplines');
            if (response.data.status) {
                await socket.sendMessage(msg.key.remoteJid, { 
                    text: `💘 *Pickup Line:*\n\n${response.data.result}`
                });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('Pickup line command error:', error);
            await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Failed to fetch pickup line. Please try again later.' 
            });
        }
    }
};