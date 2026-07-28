const axios = require('axios');

module.exports = {
    name: 'kbc',
    category: '𝐍𝐄𝐖𝐒 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get latest news from KBC',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/news/kbc');
            if (response.data.status) {
                const news = response.data.result;
                let newsText = `📡 *ATLAS-MB KBC NEWS*\n━━━━━━━━━━━━━━━━\n🏛️ ${news.title}\n🔗 ${news.baseUrl}\n\n`;
                
                if (news.breakingNews && news.breakingNews.length > 0) {
                    newsText += `*🚨 BREAKING NEWS:*\n`;
                    news.breakingNews.slice(0, 3).forEach((item, i) => {
                        newsText += `${i+1}. ${item.title}\n`;
                    });
                }
                
                if (news.featuredArticles && news.featuredArticles.channel1News) {
                    newsText += `\n*📰 FEATURED NEWS:*\n`;
                    news.featuredArticles.channel1News.slice(0, 5).forEach((article, i) => {
                        newsText += `${i+1}. ${article.title}\n`;
                        if (article.date) newsText += `   📅 ${new Date(article.date).toLocaleDateString()}\n`;
                    });
                }
                
                await socket.sendMessage(msg.key.remoteJid, { text: newsText });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('KBC news error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch KBC news. Please try again later.' });
        }
    }
};