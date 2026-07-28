module.exports = {
    name: 'autolike',
    category: '𝐀𝐔𝐓𝐎 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Auto react to status updates',
    async execute(socket, msg, number, config, loadUserConfig, activeSockets, socketCreationTime, extra) {
        const { updateUserAutoSettings, loadUserAutoSettings } = extra;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userNumber = sender.split('@')[0];
        
        const args = msg.message?.conversation?.split(' ') || 
                     msg.message?.extendedTextMessage?.text?.split(' ') || [];
        
        const action = args[1]?.toLowerCase();
        const emoji = args[2];
        
        if (action === 'on') {
            const settings = { autolike: true };
            if (emoji && emoji !== 'random') {
                settings.autolikeemoji = emoji;
            }
            await updateUserAutoSettings(userNumber, settings);
            await socket.sendMessage(msg.key.remoteJid, { text: `✅ Auto-like enabled!\n📝 Emoji: ${settings.autolikeemoji || 'random'}` });
        } else if (action === 'off') {
            await updateUserAutoSettings(userNumber, { autolike: false });
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Auto-like disabled.' });
        } else if (action === 'set' && emoji) {
            await updateUserAutoSettings(userNumber, { autolikeemoji: emoji });
            await socket.sendMessage(msg.key.remoteJid, { text: `✅ Auto-like emoji set to: ${emoji}` });
        } else {
            const settings = await loadUserAutoSettings(userNumber);
            const status = settings.autolike ? 'ON ✅' : 'OFF ❌';
            await socket.sendMessage(msg.key.remoteJid, { text: `❤️ Auto-like: ${status}\n🎭 Emoji: ${settings.autolikeemoji}\n\nCommands:\n.autolike on\n.autolike off\n.autolike set ❤️` });
        }
    }
};