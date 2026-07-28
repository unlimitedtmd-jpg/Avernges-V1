module.exports = {
    name: 'autobio',
    category: '𝐀𝐔𝐓𝐎 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Auto update bot bio with time/date',
    async execute(socket, msg, number, config, loadUserConfig, activeSockets, socketCreationTime, extra) {
        const { updateUserAutoSettings, loadUserAutoSettings, startAutoBio, stopAutoBio } = extra;
        const sender = msg.key.participant || msg.key.remoteJid;
        const userNumber = sender.split('@')[0];
        
        const args = msg.message?.conversation?.split(' ') || 
                     msg.message?.extendedTextMessage?.text?.split(' ') || [];
        
        const action = args[1]?.toLowerCase();
        const bioText = args.slice(2).join(' ');
        
        if (action === 'on') {
            const settings = { autobio: true };
            if (bioText) settings.autobioText = bioText;
            await updateUserAutoSettings(userNumber, settings);
            await startAutoBio(socket, userNumber, settings.autobioText);
            await socket.sendMessage(msg.key.remoteJid, { text: '✅ Auto-bio enabled! Updates every minute.' });
        } else if (action === 'off') {
            await updateUserAutoSettings(userNumber, { autobio: false });
            await stopAutoBio(userNumber);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Auto-bio disabled.' });
        } else if (action === 'text' && bioText) {
            await updateUserAutoSettings(userNumber, { autobioText: bioText });
            const settings = await loadUserAutoSettings(userNumber);
            if (settings.autobio) {
                await stopAutoBio(userNumber);
                await startAutoBio(socket, userNumber, bioText);
            }
            await socket.sendMessage(msg.key.remoteJid, { text: `✅ Auto-bio text set to: ${bioText}` });
        } else {
            const settings = await loadUserAutoSettings(userNumber);
            await socket.sendMessage(msg.key.remoteJid, { text: `📝 Auto-bio: ${settings.autobio ? 'ON ✅' : 'OFF ❌'}\n📄 Text: ${settings.autobioText}\n\n.autobio on [text]\n.autobio off\n.autobio text [new text]` });
        }
    }
};