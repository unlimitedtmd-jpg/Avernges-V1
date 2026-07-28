module.exports = {
    name: 'leave',
    category: '𝐎𝐖𝐍𝐄𝐑 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Bot leave group (Owner only)',
    async execute(socket, msg, number, userConfig, loadUserConfigFromMongo, activeSockets, socketCreationTime, extra) {
        // Super user / Owner number
        const OWNER_NUMBER = '255752593977'; // Replace with your actual owner number
        const sender = msg.key.participant || msg.key.remoteJid;
        const senderNumber = sender.split('@')[0];
        
        // Check if sender is owner
        const isOwner = senderNumber === OWNER_NUMBER || 
                       (userConfig?.OWNER_NUMBER && senderNumber === userConfig.OWNER_NUMBER);
        
        if (!isOwner) {
            await socket.sendMessage(msg.key.remoteJid, { 
                text: "❌ *Access Denied!*\n\nThis command is only available to the bot owner.\nContact @255752593977 for assistance.",
                mentions: ['255752593977@s.whatsapp.net']
            });
            return;
        }
        
        // Check if command is used in a group
        if (!msg.key.remoteJid.endsWith('@g.us')) {
            await socket.sendMessage(msg.key.remoteJid, { 
                text: "❌ This command can only be used in groups." 
            });
            return;
        }
        
        // Get group name for confirmation message
        let groupName = "this group";
        try {
            const groupMetadata = await socket.groupMetadata(msg.key.remoteJid);
            groupName = groupMetadata.subject || "this group";
        } catch (error) {
            console.error('Failed to get group name:', error);
        }
        
        // Optional: Add confirmation to prevent accidental leave
        const args = msg.message?.conversation?.split(' ') || 
                     msg.message?.extendedTextMessage?.text?.split(' ') || [];
        
        const confirm = args[1]?.toLowerCase();
        
        if (confirm !== 'confirm') {
            await socket.sendMessage(msg.key.remoteJid, { 
                text: `⚠️ *Confirm Bot Leave*\n\nAre you sure you want me to leave *${groupName}*?\n\nType: *.leave confirm* to confirm.\n\n_This action cannot be undone._` 
            });
            return;
        }
        
        // Send goodbye message
        await socket.sendMessage(msg.key.remoteJid, { 
            text: `👋 *Goodbye!*\n\nATLAS-MB bot is leaving *${groupName}*.\n\n_It was nice being here!_ ✌️\n\n> Powered by Fredi_Ezra` 
        });
        
        // Small delay to ensure message is sent
        setTimeout(async () => {
            try {
                await socket.groupLeave(msg.key.remoteJid);
                console.log(`✅ Bot left group: ${groupName} (${msg.key.remoteJid}) by owner ${senderNumber}`);
            } catch (error) {
                console.error('Failed to leave group:', error);
                await socket.sendMessage(msg.key.remoteJid, { 
                    text: "❌ Failed to leave group. Make sure I am still in the group." 
                }).catch(() => {});
            }
        }, 2000);
    }
};