const FOOTER = '\n\n╭─╣\n│ 🔗 Free-Mini-Bot\n│ https://atlas-mb.vercel.app\n│ ⚡ Powered by FrediEzraツ\n╰─╣⁠';

module.exports = {
    name: 'demote',
    description: 'Demote an admin to regular member',
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
┃ There is nobody to demote here.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        if (!isBotAdmin) {
            return socket.sendMessage(from, {
                text: `╭─╣ ❌ DEMOTE FAILED ╠⁠┈┈
┃ I am not an admin in this group.
┃ I cannot demote anyone without permission.
┃ Please grant me admin rights first.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        if (!isAdmin) {
            return socket.sendMessage(from, {
                text: `╭─╣ 🚫 ACCESS DENIED ╠⁠┈┈
┃ Only group admins can demote members.
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
┃ Tag or reply to the admin
┃ you want to demote.
╰─╣⁠` + FOOTER
                }, { quoted: msg });
            }

            const targetNum = targetJid.split('@')[0].split(':')[0];
            const senderNum = sender.split('@')[0].split(':')[0];

            // Cannot demote yourself
            if (targetJid === sender) {
                return socket.sendMessage(from, {
                    text: `╭─╣ 🚫 CANNOT DEMOTE SELF ╠⁠┈┈
┃ You cannot demote yourself.
┃ Ask another admin to do it.
╰─╣⁠` + FOOTER
                }, { quoted: msg });
            }

            const metadata = extras?.groupMetadata || await socket.groupMetadata(from).catch(() => null);
            if (metadata) {
                const isTargetAdmin = metadata.participants.some(p => {
                    const pJid = p.jid || p.id;
                    return pJid === targetJid && p.admin !== null;
                });
                
                if (!isTargetAdmin) {
                    return socket.sendMessage(from, {
                        text: `╭─╣ ⚠️ NOT AN ADMIN ╠⁠┈┈
┃ @${targetNum} is not an admin.
┃ Cannot demote a regular member.
╰─╣⁠` + FOOTER,
                        mentions: [targetJid]
                    }, { quoted: msg });
                }
            }

            await socket.groupParticipantsUpdate(from, [targetJid], 'demote');

            await socket.sendMessage(from, {
                text: `╭─╣ 🔽 DEMOTED ╠⁠┈┈
┃ 👤 User   : @${targetNum}
┃ 📉 Status : Demoted to Member
┃ 👮 Action : By @${senderNum}
╰─╣⁠

Admin privileges have been revoked.` + FOOTER,
                mentions: [targetJid, sender]
            }, { quoted: msg });

        } catch (error) {
            await socket.sendMessage(from, {
                text: `╭─╣ ⚠️ ERROR ╠⁠┈┈
┃ Failed to demote the user.
┃ Please try again.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }
    }
};