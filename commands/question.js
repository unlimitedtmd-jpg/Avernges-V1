const axios = require('axios');

module.exports = {
    name: 'quiz',
    category: '𝐅𝐔𝐍 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒',
    description: 'Get a random trivia question',
    async execute(socket, msg, args) {
        try {
            const response = await axios.get('https://apiskeith.top/fun/question');
            if (response.data.status) {
                const q = response.data.result;
                const answers = q.allAnswers.map((ans, i) => `${i+1}. ${ans}`).join('\n');
                
                const questionText = `❓ *Trivia Question*\n\n📚 *Category:* ${q.category}\n⭐ *Difficulty:* ${q.difficulty}\n\n📝 *Question:* ${q.question}\n\n🔘 *Options:*\n${answers}\n\n💡 *Correct Answer:* ${q.correctAnswer}`;
                
                await socket.sendMessage(msg.key.remoteJid, { text: questionText });
            } else {
                throw new Error('API returned false');
            }
        } catch (error) {
            console.error('Question command error:', error);
            await socket.sendMessage(msg.key.remoteJid, { 
                text: '❌ Failed to fetch question. Please try again later.' 
            });
        }
    }
};