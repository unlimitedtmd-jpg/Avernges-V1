const FOOTER = '\n\n╭─╣\n│ 🔗 Free-Mini-Bot\n│ https://atlas-mb.vercel.app\n│ ⚡ Powered by FrediEzraツ\n╰─╣⁠';

module.exports = {
    name: 'promote',
    description: 'Promote a member to admin',
    async execute(socket, msg, number, config, loadUserConfigFromMongo, activeSockets, socketCreationTime, extras) {
        const from = extras?.from || msg.key.remoteJid;
        const isGroup = extras?.isGroup ?? from.endsWith('@g.us');
        const sender = extras?.sender || msg.key.participant || from;
        const isBotAdmin = extras?.isBotAdmin || false;
        const isAdmin = extras?.isAdmin || false;

        if (!isGroup) {
            return socket.sendMessage(from, {
                text: `╭─╣ ⚠️ GROUP ONLY ╠⁠┈┈
┃ This command only works in groups.
┃ There is nobody to promote here.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        if (!isBotAdmin) {
            return socket.sendMessage(from, {
                text: `╭─╣ ❌ PROMOTE FAILED ╠⁠┈┈
┃ I am not an admin in this group.
┃ I cannot promote anyone without permission.
┃ Please grant me admin rights first.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        if (!isAdmin) {
            return socket.sendMessage(from, {
                text: `╭─╣ 🚫 ACCESS DENIED ╠⁠┈┈
┃ Only group admins can promote members.
┃ Permission required.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        try {
            let targetJid = null;
            const quoted = msg.message?.extendedTextMessage?.contextInfo;
            if (quoted?.participant) {
                targetJid = quoted.participant;
            } else if (quoted?.mentionedJid?.length > 0) {
                targetJid = quoted.mentionedJid[0];
            }

            if (!targetJid) {
                const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
                const args = body.split(' ').slice(1);
                if (args[0]) {
                    const num = args[0].replace(/[^0-9]/g, '');
                    if (num) targetJid = num + '@s.whatsapp.net';
                }
            }

            if (!targetJid) {
                return socket.sendMessage(from, {
                    text: `╭─╣ ⚠️ TARGET REQUIRED ╠⁠┈┈
┃ Tag or reply to the member
┃ you want to promote.
╰─╣⁠` + FOOTER
                }, { quoted: msg });
            }

            const targetNum = targetJid.split('@')[0].split(':')[0];
            const senderNum = sender.split('@')[0].split(':')[0];

            const metadata = extras?.groupMetadata || await socket.groupMetadata(from).catch(() => null);
            if (metadata) {
                const alreadyAdmin = metadata.participants.some(p => {
                    const pJid = p.jid || p.id;
                    return pJid === targetJid && p.admin !== null;
                });
                if (alreadyAdmin) {
                    return socket.sendMessage(from, {
                        text: `╭─╣ ⚠️ ALREADY ADMIN ╠⁠┈┈
┃ @${targetNum} is already an admin.
┃ No further promotion possible.
╰─╣⁠` + FOOTER,
                        mentions: [targetJid]
                    }, { quoted: msg });
                }
            }

            await socket.groupParticipantsUpdate(from, [targetJid], 'promote');

            await socket.sendMessage(from, {
                text: `╭─╣ 🔼 PROMOTED ╠⁠┈┈
┃ 👤 User   : @${targetNum}
┃ 📈 Status : Promoted to Admin
┃ 👮 Action : By @${senderNum}
╰─╣⁠

Congratulations! You now have administrative privileges.` + FOOTER,
                mentions: [targetJid, sender]
            }, { quoted: msg });

        } catch (error) {
            await socket.sendMessage(from, {
                text: `╭─╣ ⚠️ ERROR ╠⁠┈┈
┃ Failed to promote the user.
┃ Please try again.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }
    }
};
