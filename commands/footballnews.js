const axios = require('axios');

module.exports = {
    name: 'footballnews',
    category: '𝐍𝐄𝐖𝐒 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get latest football news',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/football/news');
            if (response.data.status) {
                const football = response.data.result;
                let newsText = `⚽ *ATLAS-MB FOOTBALL NEWS*\n━━━━━━━━━━━━━━━━\n📰 Latest Updates\n\n`;
                
                if (football.data && football.data.items && football.data.items.length > 0) {
                    football.data.items.slice(0, 10).forEach((item, i) => {
                        newsText += `${i+1}. *${item.title}*\n`;
                        if (item.summary) newsText += `   📝 ${item.summary.substring(0, 120)}...\n`;
                        newsText += `   🔗 https://apiskeith.top${item.detailPath}\n`;
                        if (item.createdAt) {
                            const date = new Date(parseInt(item.createdAt));
                            newsText += `   📅 ${date.toLocaleDateString()}\n`;
                        }
                        newsText += `\n`;
                    });
                } else {
                    newsText += `⚠️ No football news available at the moment.\n`;
                }
                
                await socket.sendMessage(msg.key.remoteJid, { text: newsText });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('Football news error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch football news. Please try again later.' });
        }
    }
};