const axios = require('axios');

module.exports = {
    name: 'searchnews',
    category: '𝐍𝐄𝐖𝐒 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Search news on Kenyans.co.ke',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide a search query.\nUsage: .searchnews [query]\nExample: .searchnews politics' 
            });
        }
        
        const query = encodeURIComponent(args.join(' '));
        
        try {
            const response = await axios.get(`https://apiskeith.top/news/kenyans/search?q=${query}`);
            if (response.data.status) {
                const results = response.data.result;
                let newsText = `🔍 *ATLAS-MB SEARCH RESULTS:* "${args.join(' ')}"\n━━━━━━━━━━━━━━━━\n`;
                
                if (results.articles && results.articles.length > 0) {
                    results.articles.slice(0, 10).forEach((article, i) => {
                        newsText += `\n${i+1}. *${article.title}*\n`;
                        if (article.description) newsText += `   ${article.description.substring(0, 100)}...\n`;
                        newsText += `   🔗 ${article.url}\n`;
                    });
                } else {
                    newsText += `\n⚠️ No results found for "${args.join(' ')}".`;
                }
                
                await socket.sendMessage(msg.key.remoteJid, { text: newsText });
            } else {
                if (response.data.error === "Need search query!") {
                    await socket.sendMessage(msg.key.remoteJid, { text: '❌ Please provide a search query.\nUsage: .searchnews [query]' });
                } else {
                    throw new Error('API returned false');
                }
            }
        } catch (error) {
            console.error('News search error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to search news. Please try again later.' });
        }
    }
};