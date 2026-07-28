module.exports = {
    name: 'autosettings',
    category: '𝐀𝐔𝐓𝐎 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'View all auto settings',
    async execute(socket, msg, number, config, loadUserConfig, activeSockets, socketCreationTime, extra) {
        const { loadUserAutoSettings } = extra;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userNumber = sender.split('@')[0];
        
        const settings = await loadUserAutoSettings(userNumber);
        
        const statusText = `⚙️ *AUTO SETTINGS*\n━━━━━━━━━━━━━━━━\n\n` +
            `❤️ *Auto-Like:* ${settings.autolike ? 'ON ✅' : 'OFF ❌'}\n` +
            `   Emoji: ${settings.autolikeemoji}\n\n` +
            `👁️ *Auto-View:* ${settings.autoview ? 'ON ✅' : 'OFF ❌'}\n\n` +
            `📖 *Auto-Read:* ${settings.autoread ? 'ON ✅' : 'OFF ❌'}\n\n` +
            `😀 *Auto-React:* ${settings.autoreact ? 'ON ✅' : 'OFF ❌'}\n` +
            `   Emoji: ${settings.autoreactEmoji}\n\n` +
            `🔗 *Anti-Link:* ${settings.antilink ? 'ON ✅' : 'OFF ❌'}\n` +
            `   Action: ${settings.antilinkAction}\n\n` +
            `📝 *Auto-Bio:* ${settings.autobio ? 'ON ✅' : 'OFF ❌'}\n` +
            `   Text: ${settings.autobioText}\n\n` +
            `🟢 *Presence:* ${settings.presence === 'unavailable' ? 'Offline' : settings.presence.toUpperCase()}\n\n` +
            `━━━━━━━━━━━━━━━━\n💡 Use .help auto for more info`;
        
        await socket.sendMessage(msg.key.remoteJid, { text: statusText });
    }
};