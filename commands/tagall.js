const fs = require('fs');

module.exports = {
    name: 'tagall',
    description: 'Tag everyone in the group',
    async execute(socket, msg, number, userConfig, loadUserConfigFromMongo, activeSockets, socketCreationTime) {
        try {
            const from = msg.key.remoteJid;

            if (!from.endsWith('@g.us')) {
                return socket.sendMessage(from, { 
                    text: 'Are you slow? This command only works in groups.' 
                }, { quoted: msg });
            }

            const metadata = await socket.groupMetadata(from);
            const participants = metadata.participants;
            const mentions = participants.map(p => p.id);
            
            // Extract text after the command
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            const args = body.split(' ').slice(1).join(' ');
            const messageText = args ? args : 'Wake up. New day, new wins';

            const txt = [
                `📣 *ATLAS-MB彡 • TAG ALL ALERT*`,

`╭─╣ 📢 𝙏𝘼𝙂 • 𝘼𝙇𝙇 𝘽𝙍𝙊𝘼𝘿𝘾𝘼𝙎𝙏 ╠⁠┈┈`,
`┃`,
`┃ 📨 *Message* : ${messageText}`,
`┃ 👥 *Targets* : ${mentions.length} members`,
`┃`,
...mentions.map(id => `┃ 🔔 @${id.split('@')[0]}`),
`┃`,
`╰─╣⁠`,

`⚠️ *Attention required.* Do not ignore this notification.`,
`😈 _I already delivered this faster than your reply._`
            ].join('\n');

            await socket.sendMessage(from, { 
                text: txt, 
                mentions: mentions 
            }, { quoted: msg });

        } catch (error) {
            console.error('Tagall Error:', error);
            await socket.sendMessage(msg.key.remoteJid, { 
                text: 'Failed to tag everyone. Maybe the group is too big or you\'re just unlucky.' 
            }, { quoted: msg });
        }
    }
};
