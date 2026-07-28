const axios = require('axios');

module.exports = {
    name: 'apkdl',
    category: '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑',
    description: 'Download APK files',
    async execute(socket, msg, args) {
        if (!args[0]) {
            return await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Please provide an APK4All detail URL.\nUsage: .apkdl [url]\nExample: .apkdl https://apk4all.com/...' 
            });
        }
        
        const url = args[0];
        
        try {
            await socket.sendMessage(msg.key.remoteJid, { text: '⏳ Fetching APK download...' });
            const response = await axios.get(`https://apiskeith.top/download/apk?url=${encodeURIComponent(url)}`);
            if (response.data.status) {
                const result = response.data.result;
                await socket.sendMessage(msg.key.remoteJid, { text: `✅ *APK Download Link:*\n${result.downloadUrl || result.url}` });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: `❌ ${response.data.result || 'Invalid APK URL'}` });
            }
        } catch (error) {
            console.error('APK download error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Failed to fetch APK. Please check the URL.' });
        }
    }
};