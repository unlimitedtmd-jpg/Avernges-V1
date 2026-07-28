const axios = require('axios');

module.exports = {
    name: 'ntv',
    category: '𝐍𝐄𝐖𝐒 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get latest news from NTV',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/news/ntv');
            if (response.data.status) {
                const news = response.data.result;
                let newsText = `📺 *ATLAS MB NTV NEWS*\n━━━━━━━━━━━━━━━━\n`;
                
                if (news.topStories && news.topStories.length > 0) {
                    news.topStories.slice(0, 5).forEach((story, i) => {
                        newsText += `${i+1}. ${story.title}\n`;
                        if (story.description) newsText += `   📝 ${story.description.substring(0, 100)}...\n`;
                        newsText += `   🔗 ${story.url}\n\n`;
                    });
                } else {
                    newsText += `⚠️ No stories available at the moment.\n`;
                }
                
                await socket.sendMessage(msg.key.remoteJid, { text: newsText });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('NTV news error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch NTV news. Please try again later.' });
        }
    }
};