const axios = require('axios');

module.exports = {
    name: 'quote',
    category: '𝐅𝐔𝐍 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get an inspirational quote',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/fun/quote');
            if (response.data.status) {
                const quote = response.data.result;
                await socket.sendMessage(msg.key.remoteJid, { 
                    text: `💭 *Quote:*\n\n"${quote.quote}"\n\n— *${quote.author}*`
                });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('Quote command error:', error);
            await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Failed to fetch quote. Please try again later.' 
            });
        }
    }
};