const axios = require('axios');

module.exports = {
    name: 'aquote',
    category: '𝐅𝐔𝐍 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get an inspirational audio quote',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/quote/audio');
            if (response.data.status) {
                const audioData = response.data.result;
                // Extract text quotes from the data array
                const quotes = audioData.data
                    .filter(item => item.type === 'quote' && item.text)
                    .map(item => item.text);
                
                const quoteText = quotes.join('\n\n');
                const audioUrl = audioData.mp3;
                
                // Send the quote text first
                await socket.sendMessage(msg.key.remoteJid, { 
                    text: `🎵 *Audio Quote:*\n\n${quoteText}\n\n🎧 *Audio:* ${audioUrl}`
                });
                
                // Try to send as voice note if possible
                try {
                    await socket.sendMessage(msg.key.remoteJid, {
                        audio: { url: audioUrl },
                        mimetype: 'audio/mpeg',
                        ptt: true
                    });
                } catch (audioError) {
                    console.log('Could not send audio file');
                }
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('Audio quote command error:', error);
            await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Failed to fetch audio quote. Please try again later.' 
            });
        }
    }
};