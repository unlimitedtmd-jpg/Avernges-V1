const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const cors = require('cors');

const __path = __dirname;
const PORT = process.env.PORT || 8000;

let core = require('./core');


require('events').EventEmitter.defaultMaxListeners = 500;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- ROUTES ---
app.use('/code', core);



app.use('/', async (req, res) => {
    res.sendFile(path.join(__path, '/main.html'));
});

// --- START SERVER ---
app.listen(PORT, async () => {
    console.log(`
╭─╣    ATLAS-MB彡    ╠⁠┈┈
┃                    
┃ 🚀 Startup completed successfully
┃ ✅ Status : Running
┃ ⚡ Mode   : Online and Ready
┃ 🌍 Port   : ${PORT}
┃ 🔗 URL    : http://localhost:${PORT}
╰─╣⁠
`);
});

module.exports = app;