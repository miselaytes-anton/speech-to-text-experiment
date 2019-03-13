const DeepSpeech = require('deepspeech');

const BEAM_WIDTH = 1024;
const N_FEATURES = 26;
const N_CONTEXT = 9;
const modelPath = './models/output_graph.pbmm';
const alphabetPath = './models/alphabet.txt';
const model = new DeepSpeech.Model(modelPath, N_FEATURES, N_CONTEXT, alphabetPath, BEAM_WIDTH);
const LM_ALPHA = 0.75;
const LM_BETA = 1.85;
const lmPath = './models/lm.binary';
const triePath = './models/trie';
model.enableDecoderWithLM(alphabetPath, lmPath, triePath, LM_ALPHA, LM_BETA);

/*
// https://github.com/mozilla/DeepSpeech/tree/fc46f4382d07c994681a9fc5915ffd5383f596ef/examples/mic_vad_streaming
// https://github.com/mozilla/DeepSpeech/blob/3091b30b0516ef308944ddaaf6cf722c13b270ac/native_client/python/__init__.py
// https://github.com/mozilla/DeepSpeech/blob/master/native_client/deepspeech.h
streaming example
 const preAllocFrames = 1;
const sampleRate = 16000;
const streamContext = model.setupStream(preAllocFrames, sampleRate)
model.feedAudioContent(streamContext, buffer.slice(0, buffer.length/2))
const text = model.finishStream(streamContext)
console.log('text', text)
 */

const stt = int16Array => {
    const sampleRate = 16000;
    return model.stt(int16Array.slice(0, int16Array.length / 2), sampleRate);
};

module.exports = {
    stt,
};
