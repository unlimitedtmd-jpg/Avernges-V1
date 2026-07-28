const axios = require('axios');

module.exports = {
    name: 'bbc',
    category: '𝐍𝐄𝐖𝐒 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get latest news from BBC',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/news/bbc');
            if (response.data.status) {
                const news = response.data.result;
                let newsText = `🌍 *ATLAS MB BBC NEWS*\n━━━━━━━━━━━━━━━━\n\n`;
                
                if (news.topStories && news.topStories.length > 0) {
                    newsText += `*📰 TOP STORIES:*\n`;
                    news.topStories.slice(0, 5).forEach((story, i) => {
                        newsText += `\n${i+1}. *${story.title}*\n`;
                        if (story.description) newsText += `   ${story.description.substring(0, 150)}...\n`;
                        if (story.metadata.time) newsText += `   ⏰ ${story.metadata.time}\n`;
                        if (story.metadata.category) newsText += `   📂 ${story.metadata.category}\n`;
                        if (story.isLive) newsText += `   🔴 LIVE\n`;
                    });
                }
                
                if (news.mostRead && news.mostRead.length > 0) {
                    newsText += `\n*📈 MOST READ:*\n`;
                    news.mostRead.slice(0, 3).forEach((item, i) => {
                        newsText += `${i+1}. ${item.title}\n`;
                    });
                }
                
                await socket.sendMessage(msg.key.remoteJid, { text: newsText });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('BBC news error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch BBC news. Please try again later.' });
        }
    }
};