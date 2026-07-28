const axios = require('axios');

module.exports = {
    name: 'newstrack',
    category: '𝐍𝐄𝐖𝐒 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Track latest news updates from Kenya',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/news/kenyans/track');
            if (response.data.status) {
                const tracker = response.data.result;
                let newsText = `📊 *ATLAS-MB KENYA NEWS TRACKER*\n━━━━━━━━━━━━━━━━\n📰 ${tracker.title}\n🔗 ${tracker.url}\n📈 Total Updates: ${tracker.totalUpdates}\n\n`;
                
                if (tracker.updatesByDate && tracker.updatesByDate.length > 0) {
                    const latestDate = tracker.updatesByDate[0];
                    newsText += `*📅 ${latestDate.date}*\n`;
                    latestDate.updates.slice(0, 8).forEach((update, i) => {
                        newsText += `\n${i+1}. ${update.body.substring(0, 150)}${update.body.length > 150 ? '...' : ''}\n`;
                        if (update.links && update.links.length > 0) {
                            newsText += `   🔗 ${update.links[0].url}\n`;
                        }
                    });
                }
                
                await socket.sendMessage(msg.key.remoteJid, { text: newsText });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('News tracker error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch news tracker. Please try again later.' });
        }
    }
};