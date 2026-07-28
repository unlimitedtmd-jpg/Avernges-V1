const axios = require('axios');

module.exports = {
    name: 'nhie',
    category: '𝐅𝐔𝐍 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Play "Never Have I Ever" game',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/fun/never-have-i-ever');
            if (response.data.status) {
                await socket.sendMessage(msg.key.remoteJid, { 
                    text: `🍻 *Never Have I Ever:*\n\n${response.data.result}`
                });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('NHIE command error:', error);
            await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Failed to fetch game question. Please try again later.' 
            });
        }
    }
};