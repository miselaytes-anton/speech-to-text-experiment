const wav = require('wav');
const Duplex = require('stream').Duplex;
const bufferToStream = buffer => {
    const stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
};

const writeWav = (filename, buffer) => {
    const fileWriter = new wav.FileWriter(filename, {
        channels: 1,
        sampleRate: 16000,
        bitDepth: 16});

    const stream = bufferToStream(buffer);
    stream.pipe(fileWriter);
};

module.exports = {writeWav};
