const axios = require('axios');

module.exports = {
    name: 'joke',
    category: '𝐅𝐔𝐍 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get a random joke',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/fun/jokes');
            if (response.data.status) {
                const joke = response.data.result;
                const jokeText = `😂 *Joke:*\n\n${joke.setup}\n\n*Punchline:* ${joke.punchline}`;
                await socket.sendMessage(msg.key.remoteJid, { text: jokeText });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('Joke command error:', error);
            await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Failed to fetch joke. Please try again later.' 
            });
        }
    }
};