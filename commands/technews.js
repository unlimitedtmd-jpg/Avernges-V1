const axios = require('axios');

module.exports = {
    name: 'technews',
    category: '𝐍𝐄𝐖𝐒 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get latest technology news',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/news/tech');
            if (response.data.status) {
                const tech = response.data.result;
                let newsText = `💻 *ATLAS MB TECHNOLOGY NEWS*\n━━━━━━━━━━━━━━━━\n📡 ${tech.metadata.title}\n📝 ${tech.metadata.description}\n🔗 ${tech.metadata.url}\n\n`;
                
                if (tech.featuredArticles && tech.featuredArticles.length > 0) {
                    newsText += `*⭐ FEATURED:*\n`;
                    tech.featuredArticles.slice(0, 5).forEach((article, i) => {
                        newsText += `\n${i+1}. *${article.title}*\n`;
                        if (article.description) newsText += `   ${article.description.substring(0, 120)}...\n`;
                        newsText += `   🔗 ${article.link}\n`;
                    });
                }
                
                if (tech.blogCategories && tech.blogCategories.length > 0) {
                    newsText += `\n*📂 CATEGORIES:*\n`;
                    tech.blogCategories.slice(0, 6).forEach(cat => {
                        newsText += `   • ${cat.name}\n`;
                    });
                }
                
                await socket.sendMessage(msg.key.remoteJid, { text: newsText });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('Tech news error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch technology news. Please try again later.' });
        }
    }
};