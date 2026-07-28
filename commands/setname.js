const FOOTER = '\n\n╭─╣\n│ 🔗 Dml-Mini-Bot\n│ https:/atlas-mb.vercel.app\n│ ⚡ Powered by FrediEzraツ\n╰─╣⁠';

module.exports = {
    name: 'setname',
    description: 'Change the group name',

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
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        if (!isBotAdmin) {
            return socket.sendMessage(from, {
                text: `╭─╣ ❌ BOT NOT ADMIN ╠⁠┈┈
┃ I must be an admin to
┃ change the group name.
┃ Promote me first.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        if (!isAdmin) {
            return socket.sendMessage(from, {
                text: `╭─╣ 🚫 ADMIN ONLY ╠⁠┈┈
┃ Only group admins can
┃ change the group name.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        try {
            const body =
                msg.message?.conversation ||
                msg.message?.extendedTextMessage?.text ||
                '';

            const newName = body.trim().split(/\s+/).slice(1).join(' ').trim();

            if (!newName) {
                return socket.sendMessage(from, {
                    text: `╭─╣ 📘 USAGE ╠⁠┈┈
┃ .setname <new group name>
┃ Example:
┃ .setname My Awesome Group
╰─╣⁠` + FOOTER
                }, { quoted: msg });
            }

            if (newName.length > 100) {
                return socket.sendMessage(from, {
                    text: `╭─╣ ⚠️ NAME TOO LONG ╠⁠┈┈
┃ Group name must be under
┃ 100 characters.
╰─╣⁠` + FOOTER
                }, { quoted: msg });
            }

            const metadata = extras?.groupMetadata || await socket.groupMetadata(from).catch(() => null);
            if (!metadata) throw new Error('Failed to fetch group metadata.');

            const oldName = metadata.subject;

            if (oldName === newName) {
                return socket.sendMessage(from, {
                    text: `╭─╣ ℹ️ NO CHANGE ╠⁠┈┈
┃ The group already has
┃ this name.
╰─╣⁠` + FOOTER
                }, { quoted: msg });
            }

            // Update group name
            await socket.groupUpdateSubject(from, newName);

            // Verify update
            const updatedMetadata = await socket.groupMetadata(from).catch(() => null);
            const updatedName = updatedMetadata?.subject || null;

            if (updatedName !== newName) {
                throw new Error('Group name did not update.');
            }

            const senderNum = sender.split('@')[0].split(':')[0];

            await socket.sendMessage(from, {
                text: `╭─╣ ✅ NAME UPDATED ╠⁠┈┈
┃ 🏷 Old Name : ${oldName}
┃ ✨ New Name : ${updatedName}
┃ 👤 Changed By : @${senderNum}
╰─╣⁠

Group name successfully changed.` + FOOTER,
                mentions: [sender]
            }, { quoted: msg });

        } catch (error) {
            console.error('Setname error:', error);

            await socket.sendMessage(from, {
                text: `╭─╣ ⚠️ UPDATE FAILED ╠⁠┈┈
┃ Unable to change group name.
┃ Make sure:
┃ • I am admin
┃ • You are admin
┃ • Name is valid
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }
    }
};
