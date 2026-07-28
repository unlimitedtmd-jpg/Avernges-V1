const axios = require('axios');

module.exports = {
    name: 'citizen',
    category: '𝐍𝐄𝐖𝐒 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get latest news from Citizen Digital',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/news/citizen');
            if (response.data.status) {
                const news = response.data.result;
                let newsText = `📰 *ATLAS CITIZEN DIGITAL NEWS*\n━━━━━━━━━━━━━━━━\n📅 Last Updated: ${new Date(news.lastUpdated).toLocaleString()}\n🔗 Source: ${news.url}\n\n`;
                
                if (news.topStories && news.topStories.length > 0) {
                    newsText += `*🔥 TOP STORIES:*\n`;
                    news.topStories.slice(0, 5).forEach((story, i) => {
                        newsText += `${i+1}. ${story.title || 'No title'}\n`;
                    });
                } else {
                    newsText += `⚠️ No top stories available at the moment.\n`;
                }
                
                await socket.sendMessage(msg.key.remoteJid, { text: newsText });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('Citizen news error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch Citizen news. Please try again later.' });
        }
    }
};