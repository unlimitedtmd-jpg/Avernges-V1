const axios = require('axios');

module.exports = {
    name: 'weather',
    description: 'Get weather info for a city.',
    async execute(socket, msg, number, userConfig, loadUserConfigFromMongo, activeSockets, socketCreationTime) {
        try {
            const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            const text = body.split(' ').slice(1).join(' ').trim();

            if (!text) {
                return socket.sendMessage(msg.key.remoteJid, { 
                    text: `Yo, genius, give me a city name! Don’t waste my time.` 
                }, { quoted: msg });
            }

            const { data } = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=1ad47ec6172f19dfaf89eb3307f74785`);

            const cityName = data.name;
            const temperature = data.main.temp;
            const feelsLike = data.main.feels_like;
            const description = data.weather[0].description;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const cloudiness = data.clouds.all;

            const weatherReport =`🌦️ *LIVE WEATHER REPORT*

╭─╣ 🌍 ATLAS-MB彡 • WEATHER ╠⁠┈┈
┃
┃ 📍 *City*       : ${cityName}
┃ 🌡️ *Temperature*: ${temperature}°C
┃ 🥵 *Feels Like* : ${feelsLike}°C
┃ 📝 *Condition*  : ${description}
┃ 💧 *Humidity*   : ${humidity}%
┃ 🌀 *Wind Speed* : ${windSpeed} m/s
┃ ☁️ *Cloud Cover*: ${cloudiness}%
┃
╰─╣⁠

😌 _There you go. The sky has spoken._`;

            await socket.sendMessage(msg.key.remoteJid, { text: weatherReport }, { quoted: msg });

        } catch (e) {
            await socket.sendMessage(msg.key.remoteJid, { 
                text: `What the hell? Can’t find that place. Pick a real city, idiot.` 
            }, { quoted: msg });
        }
    }
};
