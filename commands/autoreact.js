module.exports = {
    name: 'autoreact',
    category: '𝐀𝐔𝐓𝐎 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Auto react to messages in DMs and groups',
    async execute(socket, msg, number, config, loadUserConfig, activeSockets, socketCreationTime, extra) {
        const { updateUserAutoSettings, loadUserAutoSettings } = extra;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userNumber = sender.split('@')[0];
        
        const args = msg.message?.conversation?.split(' ') || 
                     msg.message?.extendedTextMessage?.text?.split(' ') || [];
        
        const action = args[1]?.toLowerCase();
        const emoji = args[2];
        
        if (action === 'on') {
            const settings = { autoreact: true };
            if (emoji) settings.autoreactEmoji = emoji;
            await updateUserAutoSettings(userNumber, settings);
            await socket.sendMessage(msg.key.remoteJid, { text: `✅ Auto-react enabled!\n📝 Emoji: ${settings.autoreactEmoji || '❤️'}` });
        } else if (action === 'off') {
            await updateUserAutoSettings(userNumber, { autoreact: false });
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Auto-react disabled.' });
        } else if (action === 'set' && emoji) {
            await updateUserAutoSettings(userNumber, { autoreactEmoji: emoji });
            await socket.sendMessage(msg.key.remoteJid, { text: `✅ Auto-react emoji set to: ${emoji}` });
        } else {
            const settings = await loadUserAutoSettings(userNumber);
            await socket.sendMessage(msg.key.remoteJid, { text: `😀 Auto-react: ${settings.autoreact ? 'ON ✅' : 'OFF ❌'}\n🎭 Emoji: ${settings.autoreactEmoji}\n\n.autoreact on\n.autoreact off\n.autoreact set ❤️` });
        }
    }
};