const axios = require('axios');
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'pair',
    description: 'Pair a new number',

    async execute(socket, msg) {
        const args = msg.message?.conversation
            ? msg.message.conversation.split(' ')
            : msg.message?.extendedTextMessage?.text
            ? msg.message.extendedTextMessage.text.split(' ')
            : [];

        let targetNumber = args[1];

        if (!targetNumber) {
            return await socket.sendMessage(
                msg.key.remoteJid,
                { text: '❌ Please provide a number\nUsage: .pair 2557********' },
                { quoted: msg }
            );
        }

        targetNumber = targetNumber.replace(/\D/g, '');

        if (targetNumber.length < 9) {
            return await socket.sendMessage(
                msg.key.remoteJid,
                { text: '❌ Invalid number. Include country code (e.g., 2557********)' },
                { quoted: msg }
            );
        }

        try {
            await socket.sendMessage(
                msg.key.remoteJid,
                { text: `⏳ Generating pairing code for ${targetNumber}...` },
                { quoted: msg }
            );

            const response = await axios.get(
                `https://atlas-mb.vercel.app/code?number=${targetNumber}`
            );

            if (!response.data?.code) {
                return await socket.sendMessage(
                    msg.key.remoteJid,
                    { text: '❌ Failed to generate pairing code.' },
                    { quoted: msg }
                );
            }

            const pairingCode = response.data.code;

            const caption = `╭─╣ 🔐 ATLAS-MB彡 • PAIRING ╠⁠┈┈
┃ 📱 *Number* : ${targetNumber}
┃ 🔑 *Code*   : ${pairingCode}
┃ 🟢 *Status* : ACTIVE
╰─╣⁠

📌 *How to link your device*
1️⃣ Open WhatsApp → Settings  
2️⃣ Tap Linked Devices  
3️⃣ Choose Link a Device  
4️⃣ Enter the pairing code above  

⚠️ This code is temporary. Pair immediately.`;

            const message = generateWAMessageFromContent(
                msg.key.remoteJid,
                {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: {
                                body: { text: caption },
                                footer: { text: "Powered By FrediEzraツ" },
                                header: {
                                    title: "🔗 Pairing Code",
                                    hasMediaAttachment: false
                                },
                                nativeFlowMessage: {
                                    buttons: [
                                        {
                                            name: "cta_copy",
                                            buttonParamsJson: JSON.stringify({
                                                display_text: "Copy Code",
                                                copy_code: pairingCode
                                            })
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                { quoted: msg }
            );

            await socket.relayMessage(
                msg.key.remoteJid,
                message.message,
                { messageId: message.key.id }
            );

        } catch (error) {
            await socket.sendMessage(
                msg.key.remoteJid,
                { text: `❌ Failed to generate pairing code: ${error.message}` },
                { quoted: msg }
            );
        }
    }
};
