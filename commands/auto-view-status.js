module.exports = {
    name: 'autoview',
    category: '𝐀𝐔𝐓𝐎 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Auto view status updates',
    async execute(socket, msg, number, config, loadUserConfig, activeSockets, socketCreationTime, extra) {
        const { updateUserAutoSettings, loadUserAutoSettings } = extra;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userNumber = sender.split('@')[0];
        
        const args = msg.message?.conversation?.split(' ') || 
                     msg.message?.extendedTextMessage?.text?.split(' ') || [];
        const action = args[1]?.toLowerCase();
        
        if (action === 'on') {
            await updateUserAutoSettings(userNumber, { autoview: true });
            await socket.sendMessage(msg.key.remoteJid, { text: '✅ Auto-view enabled!' });
        } else if (action === 'off') {
            await updateUserAutoSettings(userNumber, { autoview: false });
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Auto-view disabled.' });
        } else {
            const settings = await loadUserAutoSettings(userNumber);
            await socket.sendMessage(msg.key.remoteJid, { text: `👁️ Auto-view: ${settings.autoview ? 'ON ✅' : 'OFF ❌'}\n\n.autoview on\n.autoview off` });
        }
    }
};