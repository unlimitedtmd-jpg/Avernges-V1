module.exports = {
    name: 'presence',
    category: '𝐀𝐔𝐓𝐎 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Set bot presence (online, typing, recording, offline)',
    async execute(socket, msg, number, config, loadUserConfig, activeSockets, socketCreationTime, extra) {
        const { updateUserAutoSettings, loadUserAutoSettings } = extra;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userNumber = sender.split('@')[0];
        
        const args = msg.message?.conversation?.split(' ') || 
                     msg.message?.extendedTextMessage?.text?.split(' ') || [];
        const action = args[1]?.toLowerCase();
        
        const validPresence = ['online', 'typing', 'recording', 'offline'];
        
        if (action && validPresence.includes(action)) {
            let presenceValue = action === 'offline' ? 'unavailable' : action;
            await updateUserAutoSettings(userNumber, { presence: presenceValue });
            await socket.sendMessage(msg.key.remoteJid, { text: `✅ Presence set to: ${action.toUpperCase()}` });
        } else {
            const settings = await loadUserAutoSettings(userNumber);
            const currentPresence = settings.presence === 'unavailable' ? 'offline' : settings.presence;
            await socket.sendMessage(msg.key.remoteJid, { text: `🟢 Presence: ${currentPresence.toUpperCase()}\n\n.presence online\n.presence typing\n.presence recording\n.presence offline` });
        }
    }
};