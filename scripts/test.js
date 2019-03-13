const fs = require('fs');
const WavDecoder = require('wav-decoder');
const {stt} = require('../server/stt');

const readFile = filepath => new Promise((resolve, reject) =>
    fs.readFile(filepath, (err, buffer) => err ? reject(err) : resolve(buffer))
);

const FILENAME = process.argv[2] || './audio/rodent.wav';
readFile(FILENAME).then(buffer => {
    console.time('wavBuffer');
    const text = stt(buffer);
    console.log('=>', text);
    console.timeEnd('wavBuffer');

    return WavDecoder.decode(buffer);
});
