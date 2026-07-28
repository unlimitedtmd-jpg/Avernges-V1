const FOOTER = '\n\n╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈╮\n│ 🔗 Free-Mini-Bot\n│ https://atlas-mb.vercel.app\n│ ⚡ Powered by Fredie\n╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈╯';

module.exports = {
    name: 'close',
    description: 'Close group - only admins can send messages',
    async execute(socket, msg, number, config, loadUserConfigFromMongo, activeSockets, socketCreationTime, extras) {
        const from = extras?.from || msg.key.remoteJid;
        const isGroup = extras?.isGroup ?? from.endsWith('@g.us');
        const sender = extras?.sender || msg.key.participant || from;
        const isBotAdmin = extras?.isBotAdmin || false;
        const isAdmin = extras?.isAdmin || false;

        if (!isGroup) {
            return socket.sendMessage(from, {
                text: `╭─╣ ⚠️ GROUP ONLY 』╠⁠┈┈
┃ This command works only in groups.
┃ There is no group to close here.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        if (!isBotAdmin) {
            return socket.sendMessage(from, {
                text: `╭─╣ ❌ CLOSE FAILED 』╠⁠┈┈
┃ I am not an admin in this group.
┃ I cannot modify group settings.
┃ Please grant admin access first.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        if (!isAdmin) {
            return socket.sendMessage(from, {
                text: `╭─╣ 🚫 ACCESS DENIED 』╠⁠┈┈
┃ Only group admins can
┃ change group permissions.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        try {
            const senderNum = sender.split('@')[0].split(':')[0];

            await socket.groupSettingUpdate(from, 'announcement');

            await socket.sendMessage(from, {
                text: `╭─╣ 🔒 GROUP CLOSED 』╠⁠┈┈
┃ 📢 Status : Group is now Closed
┃ 🛑 Mode   : Only admins can chat
┃ 👤 Action : By @${senderNum}
╰─╣⁠

Group messaging has been restricted to admins.` + FOOTER,
                mentions: [sender]
            }, { quoted: msg });

        } catch (error) {
            await socket.sendMessage(from, {
                text: `╭─╣ ⚠️ ERROR 』╠⁠┈┈
┃ Failed to close the group.
┃ Please try again.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }
    }
};
