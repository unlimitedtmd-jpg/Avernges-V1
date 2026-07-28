const FOOTER = '\n\n*Free-Mini-Bot Link* https://atlas-mb.vercel.app\n> Powered by FrediEzraツ';

module.exports = {
    name: 'groupinfo',
    description: 'Show group information',
    async execute(socket, msg, number, config, loadUserConfigFromMongo, activeSockets, socketCreationTime, extras) {
        const from = extras?.from || msg.key.remoteJid;
        const isGroup = extras?.isGroup ?? from.endsWith('@g.us');
        const isBotAdmin = extras?.isBotAdmin || false;

        if (!isGroup) {
            return socket.sendMessage(from, {
                text: '*There is no group info in a Dm. Obviously.*' + FOOTER
            }, { quoted: msg });
        }

        try {
            const metadata = extras?.groupMetadata || await socket.groupMetadata(from);
            const admins = metadata.participants.filter(p => p.admin !== null);
            const owner = metadata.participants.find(p => p.admin === 'superadmin');

            const adminList = admins.map(a => {
                const pJid = a.jid || a.id;
                return `> @${pJid.split('@')[0].split(':')[0]}`;
            }).join('\n');

            const ownerJid = owner ? (owner.jid || owner.id) : null;

            const text = `╭─╣ 👥 𝐆𝐑𝐎𝐔𝐏 𝐃𝐀𝐒𝐇𝐁𝐎𝐀𝐑𝐃 ╠⁠┈┈
┃ 🏷️ 𝐍𝐚𝐦𝐞      : ${metadata.subject}
┃ 🆔 𝐆𝐫𝐨𝐮𝐩 𝐈𝐃  : ${from}
┃ 👤 𝐌𝐞𝐦𝐛𝐞𝐫𝐬   : ${metadata.participants.length}
┃ 🛡️ 𝐀𝐝𝐦𝐢𝐧𝐬    : ${admins.length}
┃ 👑 𝐎𝐰𝐧𝐞𝐫     : ${ownerJid ? '@' + ownerJid.split('@')[0].split(':')[0] : 'Unknown'}
┃ 🤖 𝐁𝐨𝐭 𝐀𝐝𝐦𝐢𝐧 : ${isBotAdmin ? '✅ Yes' : '❌ No'}
┃ 📝 𝐃𝐞𝐬𝐜      : ${metadata.desc || 'No description'}
╰─╣⁠

╭─╣ 🛡️ 𝐀𝐃𝐌𝐈𝐍 𝐑𝐎𝐒𝐓𝐄𝐑 〕╠⁠┈┈
${adminList}
╰─╣⁠

╭─╣ 📌 𝐒𝐓𝐀𝐓𝐔𝐒 ╠⁠┈┈
┃ Group scanned successfully.
┃ All administrative data loaded.
╰─╣⁠

✨ Everything about this kingdom has been revealed.` + FOOTER;

            const mentions = admins.map(a => a.jid || a.id);
            if (ownerJid) mentions.push(ownerJid);

            await socket.sendMessage(from, { text, mentions }, { quoted: msg });

        } catch (error) {
            await socket.sendMessage(from, {
                text: '*Failed to get group info. The group is hiding its secrets from me.*' + FOOTER
            }, { quoted: msg });
        }
    }
};
