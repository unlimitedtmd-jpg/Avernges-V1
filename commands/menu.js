const fs = require('fs');
const path = require('path');

const FOOTER = '\n\n*Avernges-Mini-Bot Link* https://whatsapp.com/channel/0029Vb6uo9yJ3juwi9GYgS47\n> 𝐩𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 ᴀᴠᴇɴɢᴇʀs ᴠ1';

// Auto-detect all commands with their categories from files
function getAllCommandsWithCategories() {
    const commandsPath = path.join(__dirname, '../commands');
    const categories = {};

    if (!fs.existsSync(commandsPath)) {
        console.error('Commands folder not found:', commandsPath);
        return {};
    }

    const files = fs.readdirSync(commandsPath);
    const jsFiles = files.filter(file => file.endsWith('.js') && file !== 'menu.js' && file !== 'list.js');

    jsFiles.forEach(file => {
        const commandPath = path.join(commandsPath, file);

        try {
            // Delete require cache to get fresh data
            delete require.cache[require.resolve(commandPath)];
            const command = require(commandPath);

            const commandName = command.name || file.replace('.js', '');
            const category = command.category || '𝐆𝐄𝐍𝐄𝐑𝐀𝐋';
            
            // Get description if available
            const description = command.description || 'No description';

            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push({ name: commandName, description });
        } catch (error) {
            console.error(`Error loading command ${file}:`, error);
            // Add to general category if error occurs
            const commandName = file.replace('.js', '');
            const generalCategory = '𝐆𝐄𝐍𝐄𝐑𝐀𝐋';
            if (!categories[generalCategory]) {
                categories[generalCategory] = [];
            }
            categories[generalCategory].push({ name: commandName, description: 'Unknown command' });
        }
    });

    // Sort commands within each category
    for (const category in categories) {
        categories[category].sort((a, b) => a.name.localeCompare(b.name));
    }

    return categories;
}

// Function to get total commands count
function getTotalCommandsCount(categorizedCommands) {
    let total = 0;
    for (const commands of Object.values(categorizedCommands)) {
        total += commands.length;
    }
    return total;
}

// Function to get bot stats
async function getBotStats(activeSockets, socketCreationTime, sanitized) {
    const totalActiveBots = activeSockets ? activeSockets.size : 1;
    const startTime = socketCreationTime?.get(sanitized) || Date.now();
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    return { totalActiveBots, uptime, hours, minutes, seconds };
}

module.exports = {
    name: 'menu',
    description: 'Show main menu with detailed command list',
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

            const botStats = await getBotStats(activeSockets, socketCreationTime, sanitized);
            
            const title = userCfg.botName || 'ATLAS-MB彡';
            const sender = msg.key.participant || msg.key.remoteJid;
            const userNumber = sender.split('@')[0];

            // Get commands organized by category
            const categorizedCommands = getAllCommandsWithCategories();
            const totalCommands = getTotalCommandsCount(categorizedCommands);
            const totalCategories = Object.keys(categorizedCommands).length;

            // Build stylish menu
            let commandList = '';
            let categoryCount = 0;
            
            for (const [category, commands] of Object.entries(categorizedCommands)) {
                if (commands.length > 0) {
                    categoryCount++;
                    commandList += `\n╭─╣    \`${category}\`   ╠⁠┈┈ [${commands.length} cmds]\n`;
                    for (const cmd of commands) {
                        // Show command with description (shortened if too long)
                        const shortDesc = cmd.description.length > 40 ? cmd.description.substring(0, 37) + '...' : cmd.description;
                        commandList += `> ツ .${cmd.name}\n`;
                        if (cmd.description !== 'No description' && cmd.description !== 'Unknown command') {
                            commandList += `   └─ 📝 ${shortDesc}\n`;
                        }
                    }
                    commandList += `╰─╣⁠\n`;
                }
            }

            // Build progress bar for uptime
            const uptimePercent = Math.min(100, Math.floor((botStats.uptime / 86400) * 100));
            const progressBarLength = 20;
            const filledBars = Math.floor((uptimePercent / 100) * progressBarLength);
            const emptyBars = progressBarLength - filledBars;
            const progressBar = '█'.repeat(filledBars) + '░'.repeat(emptyBars);

            const menuText = `┏━━━━━━━━━━━━━━━━━━━━┓
┃    ᴀᴠᴇʀɴɢᴀs ᴠ1 ᴍᴇɴᴜ    
┗━━━━━━━━━━━━━━━━━━━━┛

╭─╣    \`🤖 BOT STATISTICS\`    ╠⁠┈┈
> \`⚡\` 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞 : ${title}
> \`👑\` 𝐎𝐰𝐧𝐞𝐫 : timnasax
> \`📦\` 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : 2.0.0
> \`🟢\` 𝐒𝐭𝐚𝐭𝐮𝐬 : Active
> \`📊\` 𝐔𝐩𝐭𝐢𝐦𝐞 : ${botStats.hours}h ${botStats.minutes}m ${botStats.seconds}s
> \`📈\` ${progressBar} ${uptimePercent}%
╰─╣⁠

╭─╣    \`📚 COMMANDS OVERVIEW\`    ╠⁠┈┈
> \`📁\` 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐞𝐬 : ${totalCategories}
> \`🔧\` 𝐓𝐨𝐭𝐚𝐥 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬 : ${totalCommands}
> \`💻\` 𝐀𝐜𝐭𝐢𝐯𝐞 𝐁𝐨𝐭𝐬 : ${botStats.totalActiveBots}
╰─╣⁠

${commandList}

╭─╣    \`💡 QUICK TIPS\`    ╠⁠┈┈
> \`✨\` Use .help [command] for details
> \`⚡\` Commands are case-sensitive
> \`🎯\` Prefixes: ${userConfig.PREFIXES?.slice(0, 5).join(', ') || '. , ! / #'}
> \`🌟\` Type .menu to see this again
╰─╣⁠

*Now stop staring and pick a command before I lose my patience.*
_👤 @${userNumber}_${FOOTER}`;

            const defaultImg = 'https://storage.to/u4QnMvJXz.jpeg';
            const useLogo = userCfg.logo || defaultImg;
            const imagePayload = (typeof useLogo === 'string' && useLogo.startsWith('http')) ? { url: useLogo } : { url: defaultImg };

            await socket.sendMessage(msg.key.remoteJid, {
                image: imagePayload,
                caption: menuText,
                mentions: [`${userNumber}@s.whatsapp.net`]
            }, { quoted: fakeQuoted });

        } catch (error) {
            console.error('Menu command error:', error);
            await socket.sendMessage(msg.key.remoteJid, { text: '❌ Menu broke. Even my own commands are tired of you.' });
        }
    }
};
