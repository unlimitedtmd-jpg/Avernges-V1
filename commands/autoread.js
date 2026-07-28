module.exports = {
    name: 'autoread',
    category: '𝐀𝐔𝐓𝐎 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Auto read messages in private chats',
    async execute(socket, msg, number, config, loadUserConfig, activeSockets, socketCreationTime, extra) {
        const { updateUserAutoSettings, loadUserAutoSettings } = extra;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userNumber = sender.split('@')[0];
        
        const args = msg.message?.conversation?.split(' ') || 
                     msg.message?.extendedTextMessage?.text?.split(' ') || [];
        
        const action = args[1]?.toLowerCase();
        
        if (action === 'on') {
            await updateUserAutoSettings(userNumber, { autoread: true });
            await socket.sendMessage(msg.key.remoteJid, { text: '✅ Auto-read enabled!' });
        } else if (action === 'off') {
            await updateUserAutoSettings(userNumber, { autoread: false });
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Auto-read disabled.' });
        } else {
            const settings = await loadUserAutoSettings(userNumber);
            await socket.sendMessage(msg.key.remoteJid, { text: `📖 Auto-read: ${settings.autoread ? 'ON ✅' : 'OFF ❌'}\n\n.autoread on\n.autoread off` });
        }
    }
};