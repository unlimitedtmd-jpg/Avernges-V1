const FOOTER = '\n\n╭─╣\n│ 🔗 Free-Mini-Bot\n│ https://atlas-mb.vercel.app\n│ ⚡ Powered by FrediEzraツ\n╰─╣⁠';

module.exports = {
    name: 'setdesc',
    description: 'Change the group description',

    async execute(socket, msg, number, config, loadUserConfigFromMongo, activeSockets, socketCreationTime, extras) {

        const from = extras?.from || msg.key.remoteJid;
        const isGroup = extras?.isGroup ?? from.endsWith('@g.us');
        const sender = extras?.sender || msg.key.participant || from;
        const isBotAdmin = extras?.isBotAdmin || false;
        const isAdmin = extras?.isAdmin || false;

        if (!isGroup) {
            return socket.sendMessage(from, {
                text: `╭─╣ ⚠️ GROUP ONLY ╠⁠┈┈
┃ This command works only
┃ inside groups.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        if (!isBotAdmin) {
            return socket.sendMessage(from, {
                text: `╭─╣ ❌ BOT NOT ADMIN ╠⁠┈┈
┃ I must be admin to change
┃ the group description.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        if (!isAdmin) {
            return socket.sendMessage(from, {
                text: `╭─╣ 🚫 ADMIN ONLY ╠⁠┈┈
┃ Only group admins can
┃ update the description.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        try {
            const body =
                msg.message?.conversation ||
                msg.message?.extendedTextMessage?.text ||
                '';

            const newDesc = body.trim().split(/\s+/).slice(1).join(' ').trim();

            if (!newDesc) {
                return socket.sendMessage(from, {
                    text: `╭─╣ 📘 USAGE ╠⁠┈┈
┃ .setdesc <new description>
┃ Example:
┃ .setdesc Welcome to our group
╰─╣⁠` + FOOTER
                }, { quoted: msg });
            }

            if (newDesc.length > 512) {
                return socket.sendMessage(from, {
                    text: `╭─╣ ⚠️ TOO LONG ╠⁠┈┈
┃ Description must be
┃ under 512 characters.
╰─╣⁠` + FOOTER
                }, { quoted: msg });
            }

            const metadata = extras?.groupMetadata || await socket.groupMetadata(from).catch(() => null);
            if (!metadata) throw new Error('Failed to fetch metadata.');

            const oldDesc = metadata.desc || '';

            if (oldDesc.trim() === newDesc.trim()) {
                return socket.sendMessage(from, {
                    text: `╭─╣ ℹ️ NO CHANGE ╠⁠┈┈
┃ The description is already
┃ set to that value.
╰─╣⁠` + FOOTER
                }, { quoted: msg });
            }

            // Update description
            await socket.groupUpdateDescription(from, newDesc);

            // Verify update
            const updatedMetadata = await socket.groupMetadata(from).catch(() => null);
            const updatedDesc = updatedMetadata?.desc || '';

            if (updatedDesc.trim() !== newDesc.trim()) {
                throw new Error('Description update failed verification.');
            }

            const senderNum = sender.split('@')[0].split(':')[0];

            await socket.sendMessage(from, {
                text: `╭─╣ ✅ DESCRIPTION UPDATED ╠⁠┈┈
┃ 👤 Changed By : @${senderNum}
┃ 📝 New Description Applied
╰─╣⁠

Group description successfully updated.` + FOOTER,
                mentions: [sender]
            }, { quoted: msg });

        } catch (error) {
            console.error('Setdesc error:', error);

            await socket.sendMessage(from, {
                text: `╭─╣ ⚠️ UPDATE FAILED ╠⁠┈┈
┃ Unable to change description.
┃ Make sure:
┃ • Bot is admin
┃ • You are admin
┃ • Text is valid
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }
    }
};
