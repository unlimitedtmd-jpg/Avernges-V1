const axios = require('axios');
const FormData = require('form-data');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'url',
    description: 'Uploads media to Catbox and returns a link.',
    async execute(socket, msg, number, userConfig, loadUserConfigFromMongo, activeSockets, socketCreationTime) {
        try {
            const quoted =
                msg.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
                msg.message;

            const mime =
                (quoted?.imageMessage ||
                    quoted?.videoMessage ||
                    quoted?.audioMessage ||
                    quoted?.documentMessage)?.mimetype || '';

            if (!mime) {
                return socket.sendMessage(
                    msg.key.remoteJid,
                    { text: '❌ Quote an image, video, audio, or document.' },
                    { quoted: msg }
                );
            }

            await socket.sendMessage(msg.key.remoteJid, {
                react: { text: '⌛', key: msg.key }
            });

            // Detect media
            const mediaType = mime.split('/')[0];
            const messageKey =
                quoted?.imageMessage ||
                quoted?.videoMessage ||
                quoted?.audioMessage ||
                quoted?.documentMessage;

            const stream = await downloadContentFromMessage(
                messageKey,
                mediaType === 'application' ? 'document' : mediaType
            );

            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // Size limit 256MB
            if (buffer.length > 256 * 1024 * 1024) {
                await socket.sendMessage(msg.key.remoteJid, {
                    react: { text: '❌', key: msg.key }
                });
                return socket.sendMessage(
                    msg.key.remoteJid,
                    { text: '❌ File too large (256MB max).' },
                    { quoted: msg }
                );
            }

            const form = new FormData();
            form.append('reqtype', 'fileupload');
            form.append('fileToUpload', buffer, {
                filename: `dml_${Date.now()}.${mime.split('/')[1] || 'bin'}`,
                contentType: mime
            });

            const response = await axios.post(
                'https://catbox.moe/user/api.php',
                form,
                { headers: form.getHeaders() }
            );

            if (!response.data || !response.data.includes('catbox')) {
                throw new Error('Upload rejected');
            }

            const link = response.data.trim();
            const fileSizeMB = (buffer.length / (1024 * 1024)).toFixed(2);

            await socket.sendMessage(msg.key.remoteJid, {
                react: { text: '✅', key: msg.key }
            });

            const resultText = `✅ *UPLOAD SUCCESSFUL*

╭─╣ 📤 ATLAS-MB彡 • UPLOAD ╠⁠┈┈
┃
┃ 🔗 *Link* : ${link}
┃ 📦 *Size* : ${fileSizeMB} MB
┃
╰─╣⁠

⚠️ _Save the link. It won’t be stored forever._`;

            // 🔥 INTERACTIVE MESSAGE WITH COPY BUTTON
            await socket.sendMessage(
                msg.key.remoteJid,
                {
                    interactiveMessage: {
                        header: ' Media Uploaded',
                        title: resultText,
                        footer: '> Powered By FrediEzraツ',
                        buttons: [
                            {
                                name: 'cta_copy',
                                buttonParamsJson: JSON.stringify({
                                    display_text: 'Copy Link',
                                    copy_code: link
                                })
                            }
                        ]
                    }
                },
                { quoted: msg }
            );

        } catch (err) {
            console.error('Upload error:', err);

            await socket.sendMessage(msg.key.remoteJid, {
                react: { text: '❌', key: msg.key }
            });

            await socket.sendMessage(
                msg.key.remoteJid,
                { text: '❌ Upload failed. Try again.' },
                { quoted: msg }
            );
        }
    }
};
