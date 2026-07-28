module.exports = {
    name: 'antilink',
    category: '𝐀𝐔𝐓𝐎 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Anti-link protection for groups',
    async execute(socket, msg, number, config, loadUserConfig, activeSockets, socketCreationTime, extra) {
        const { updateUserAutoSettings, loadUserAutoSettings } = extra;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userNumber = sender.split('@')[0];
        
        const args = msg.message?.conversation?.split(' ') || 
                     msg.message?.extendedTextMessage?.text?.split(' ') || [];
        
        const action = args[1]?.toLowerCase();
        const actionType = args[2]?.toLowerCase();
        
        if (action === 'on') {
            await updateUserAutoSettings(userNumber, { antilink: true });
            await socket.sendMessage(msg.key.remoteJid, { text: '✅ Anti-link enabled!' });
        } else if (action === 'off') {
            await updateUserAutoSettings(userNumber, { antilink: false });
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Anti-link disabled.' });
        } else if (action === 'action' && actionType) {
            if (['warn', 'delete', 'remove'].includes(actionType)) {
                await updateUserAutoSettings(userNumber, { antilinkAction: actionType });
                await socket.sendMessage(msg.key.remoteJid, { text: `✅ Anti-link action set to: ${actionType}` });
            } else {
                await socket.sendMessage(msg.key.remoteJid, { text: '❌ Invalid action. Use: warn, delete, or remove' });
            }
        } else {
            const settings = await loadUserAutoSettings(userNumber);
            await socket.sendMessage(msg.key.remoteJid, { text: `🔗 Anti-link: ${settings.antilink ? 'ON ✅' : 'OFF ❌'}\n⚡ Action: ${settings.antilinkAction}\n\n.antilink on\n.antilink off\n.antilink action warn/delete/remove` });
        }
    }
};