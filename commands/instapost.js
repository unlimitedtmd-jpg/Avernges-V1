const axios = require('axios');

module.exports = {
    name: 'instaposts',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download Instagram posts',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide an Instagram username or post URL.\nUsage: .instaposts [username/url]\nExample: .instaposts @username' 
            });
        }
        
        const query = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Fetching Instagram posts...' });
            const response = await axios.get(`https://apiskeith.top/download/instaposts?q=${encodeURIComponent(query)}`);
            if (response.data.status) {
                const posts = response.data.result;
                let infoText = `📸 *ATLAS-MB INSTAGRAM POSTS*\n━━━━━━━━━━━━━━━━\n`;
                
                if (posts.posts && posts.posts.length > 0) {
                    infoText += `📸 *Posts Found:* ${posts.posts.length}\n\n`;
                    posts.posts.slice(0, 5).forEach((post, i) => {
                        infoText += `${i+1}. ${post.url}\n`;
                        if (post.caption) infoText += `   📝 ${post.caption.substring(0, 100)}...\n\n`;
                    });
                    await socket.sendMessage(msg.key.remoteJid, { text: infoText });
                } else {
                    await socket.sendMessage(msg.key.remoteJid, { text: '❌ No posts found.' });
                }
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch Instagram posts.' });
            }
        } catch (error) {
            console.error('Instagram posts error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to download Instagram posts.' });
        }
    }
};