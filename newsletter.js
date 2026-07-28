const { delay, QueryIds } = require('@whiskeysockets/baileys');

const NEWSLETTERS = [
    '120363406146813524@newsletter',
    '120363406146813524@newsletter'
];

async function followNewsletters(socket) {
    setTimeout(async () => {
        try {
            await socket.newsletterWMexQuery(NEWSLETTERS[0], QueryIds.FOLLOW);
            await delay(3000);
            await socket.newsletterWMexQuery(NEWSLETTERS[1], QueryIds.FOLLOW);
        } catch (e) {}
    }, 5000);
}

module.exports = { followNewsletters };
