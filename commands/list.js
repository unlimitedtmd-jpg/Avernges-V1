const fs = require('fs');
const path = require('path');

const FOOTER = '\n\n*Free-Mini-Bot Link* https://atlas-mb.vercel.app\n> 𝐩𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 Fredi_Ezra';

// Auto-detect all commands with their categories from files
function getAllCommandsWithCategories() {
    const commandsPath = path.join(__dirname, '../commands');
    const categories = {};

    if (!fs.existsSync(commandsPath)) {
        console.error('Commands folder not found:', commandsPath);
        return {};
    }

    const files = fs.readdirSync(commandsPath);
    const jsFiles = files.filter(file => file.endsWith('.js') && file !== 'list.js');

    jsFiles.forEach(file => {
        const commandPath = path.join(commandsPath, file);
        
        try {
            // Delete require cache to get fresh data
            delete require.cache[require.resolve(commandPath)];
            const command = require(commandPath);
            
            const commandName = command.name || file.replace('.js', '');
            const category = command.category || 'Generalツ';
            
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(commandName);
        } catch (error) {
            console.error(`Error loading command ${file}:`, error);
            // Add to general category if error occurs
            const commandName = file.replace('.js', '');
            const generalCategory = 'Generalツ';
            if (!categories[generalCategory]) {
                categories[generalCategory] = [];
            }
            categories[generalCategory].push(commandName);
        }
    });

    // Sort commands within each category
    for (const category in categories) {
        categories[category].sort();
    }

    return categories;
}

module.exports = {
    name: 'list',
    description: 'Show main menu (auto-detects commands and their categories)',
    async execute(socket, msg, number, userConfig, loadUserConfigFromMongo, activeSockets, socketCreationTime) {

        const fakeQuoted = {
            key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net', id: msg.key.id },
            message: { conversation: "Verified" },
            contextInfo: { mentionedJid: [], forwardingScore: 999, isForwarded: true }
        };

        try {
            const sanitized = (number || '').replace(/[^0-9]/g, '');

            let userCfg = {};
            if (typeof loadUserConfigFromMongo === 'function') {
                userCfg = await loadUserConfigFromMongo(sanitized) || {};
            }

            const startTime = socketCreationTime.get(sanitized) || Date.now();
            const uptime = Math.floor((Date.now() - startTime) / 1000);
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            const title = userCfg.botName || 'ATLAS-MB彡';
            const sender = msg.key.participant || msg.key.remoteJid;
            const userNumber = sender.split('@')[0];

            // Get commands organized by category
            const categorizedCommands = getAllCommandsWithCategories();

            let commandList = '';
            for (const [category, commands] of Object.entries(categorizedCommands)) {
                if (commands.length > 0) {
                    commandList += `\n╭─╣    \`${category}\`   ╠⁠┈┈\n`;
                    for (const cmd of commands) {
                        commandList += `> ツ .${cmd}\n`;
                    }
                    commandList += `╰─╣⁠\n`;
                }
            }

            const text = `Ugh, *@${userNumber}*... you again? Fine, here's the menu since you clearly can't survive without me.\n\n╭─╣    \`ATLAS-MB彡 INFO\`   ╠⁠┈┈\n> \`ツ\` 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞 : ${title}\n> \`ツ\` 𝐎𝐰𝐧𝐞𝐫 : Fredi_Ezra\n> \`ツ\` 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : 1.0.1\n> \`ツ\` 𝐑𝐮𝐧 𝐓𝐢𝐦𝐞 : ${hours}h ${minutes}m ${seconds}s\n╰─╣⁠\n${commandList}\n*Now stop staring and pick a command before I lose my patience.*${FOOTER}`;

            const defaultImg = 'https://files.catbox.moe/dtmruu.jpeg';
            const useLogo = userCfg.logo || defaultImg;
            const imagePayload = (typeof useLogo === 'string' && useLogo.startsWith('http')) ? { url: useLogo } : { url: defaultImg };

            await socket.sendMessage(msg.key.remoteJid, {
                image: imagePayload,
                caption: text
            }, { quoted: fakeQuoted });

        } catch (error) {
            console.error('Menu command error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: 'Menu broke. Even my own commands are tired of you.' });
        }
    }
};