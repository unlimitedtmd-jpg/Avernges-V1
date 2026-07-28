const FOOTER = '\n\n╭─╣\n│ 🔗 Free-Mini-Bot\n│ https://atlas-mb.vercel.app\n│ ⚡ Powered by FrediEzraツ\n╰─╣⁠';

module.exports = {
    name: 'open',
    description: 'Open group - all members can send messages',
    async execute(socket, msg, number, config, loadUserConfigFromMongo, activeSockets, socketCreationTime, extras) {
        const from = extras?.from || msg.key.remoteJid;
        const isGroup = extras?.isGroup ?? from.endsWith('@g.us');
        const sender = extras?.sender || msg.key.participant || from;
        const isBotAdmin = extras?.isBotAdmin || false;
        const isAdmin = extras?.isAdmin || false;

        if (!isGroup) {
            return socket.sendMessage(from, {
                text: `╭─╣ ⚠️ GROUP ONLY ╠⁠┈┈
┃ This command works only in groups.
┃ There is no group to open here.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        if (!isBotAdmin) {
            return socket.sendMessage(from, {
                text: `╭─╣ ❌ OPEN FAILED ╠⁠┈┈
┃ I am not an admin in this group.
┃ I cannot modify group settings.
┃ Please grant admin access first.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        if (!isAdmin) {
            return socket.sendMessage(from, {
                text: `╭─╣ 🚫 ACCESS DENIED ╠⁠┈┈
┃ Only group admins can
┃ change group permissions.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }

        try {
            const senderNum = sender.split('@')[0].split(':')[0];

            await socket.groupSettingUpdate(from, 'not_announcement');

            await socket.sendMessage(from, {
                text: `╭─╣ 🔓 GROUP OPENED ╠⁠┈┈
┃ 📢 Status : Group is now Open
┃ 🗣 Mode   : All members can chat
┃ 👤 Action : By @${senderNum}
╰─╣⁠

Members are now allowed to send messages.` + FOOTER,
                mentions: [sender]
            }, { quoted: msg });

        } catch (error) {
            await socket.sendMessage(from, {
                text: `╭─╣ ⚠️ ERROR ╠⁠┈┈
┃ Failed to open the group.
┃ Please try again.
╰─╣⁠` + FOOTER
            }, { quoted: msg });
        }
    }
};
