const axios = require('axios');

module.exports = {
    name: 'connect',
    description: 'Pair a new number',
    async execute(socket, msg) {
        const args = msg.message?.conversation
            ? msg.message.conversation.split(' ')
            : msg.message?.extendedTextMessage?.text
            ? msg.message.extendedTextMessage.text.split(' ')
            : [];

        let targetNumber = args[1];

        if (!targetNumber) {
            await socket.sendMessage(
                msg.key.remoteJid,
                { text: '❌ Please provide a number\nUsage: .connect 255******' },
                { quoted: msg }
            );
            return;
        }

        targetNumber = targetNumber.replace(/\D/g, '');

        if (targetNumber.length < 9) {
            await socket.sendMessage(
                msg.key.remoteJid,
                { text: '❌ Invalid number. Include country code (e.g., 2556********)' },
                { quoted: msg }
            );
            return;
        }

        try {
            await socket.sendMessage(
                msg.key.remoteJid,
                { text: `⏳ Generating pairing code for ${targetNumber}...` },
                { quoted: msg }
            );

            const response = await axios.get(
                `https://avernges-v1.vercel.app/code?number=${targetNumber}`
            );

            if (!response.data?.code) {
                await socket.sendMessage(
                    msg.key.remoteJid,
                    { text: '❌ Failed to generate pairing code.' },
                    { quoted: msg }
                );
                return;
            }

            const pairingCode = response.data.code;

            const text = `✅ *PAIRING CODE GENERATED*

╭─╣ 🔗 𝙒𝙃𝘼𝙏𝙎𝘼𝙋𝙋 • 𝙋𝘼𝙄𝙍𝙄𝙉𝙂 ╠⁠┈┈
┃
┃ 📱 *Number* : ${targetNumber}
┃ 🔐 *Code*   : ${pairingCode}
┃ 🟢 *Status* : ACTIVE
┃
╰─╣⁠

📌 *How to link your device*
1️⃣ Open *WhatsApp* → *Settings*  
2️⃣ Tap *Linked Devices*  
3️⃣ Select *Link a Device*  
4️⃣ Enter the pairing code above  

⚠️ _Code expires shortly. Pair immediately._`;

            await socket.sendMessage(
                msg.key.remoteJid,
                {
                    interactiveMessage: {
                        header: " Pairing Code",
                        title: text,
                        footer: "> Powered By Avernges",
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
                },
                { quoted: msg }
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
