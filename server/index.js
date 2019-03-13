const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const {camelCase} = require('lodash');

const {stt} = require('./stt');
const {writeWav} = require('./utils');

const PORT = process.env.PORT || 3000;
const DEBUG = process.env.DEBUG || false;

//eslint-disable-next-line
const server = new https.createServer({
    cert: fs.readFileSync('./ssl/cert.pem'),
    key: fs.readFileSync('./ssl/key.pem')
});
const wss = new WebSocket.Server({server});
wss.binaryType = 'arraybuffer';
wss.on('connection', ws => {
    ws.on('message', message => {
        console.log(`received ${Math.round(message.length/16000/2)} sec of audio`);
        const text = stt(message);
        console.log('=>', text);
        ws.send(text);
        if (DEBUG) {
            writeWav(`./audio/${camelCase(text)}.wav`, message);
        }
    });
});

server.listen(PORT);
