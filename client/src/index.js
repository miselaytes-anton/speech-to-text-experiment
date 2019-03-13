import * as hark from 'hark';
import {Recorder} from './Recorder';

const WS_HOST = 'wss://localhost:3000';
const TARGET_SAMPLE_RATE = 16000;
const RECORD_START_LATENCY = 0.3;

const phraseDiv = document.getElementById('phrase');
const init = stream => {
  const ws = new WebSocket(WS_HOST);
  ws.binaryType = 'arraybuffer';
  ws.onopen = () => {
    const audioContext = new AudioContext();
    const recorder = new Recorder(audioContext, stream, {targetSampleRate: TARGET_SAMPLE_RATE, recordStartLatency: RECORD_START_LATENCY});
    recorder.onRecord(record => {
      ws.send(record);
    });
    const speechEvents = hark(stream, {});
    speechEvents.on('speaking', () => {
      console.log('start');
      recorder.start();
    });

    speechEvents.on('stopped_speaking', () => {
      console.log('stop');
      recorder.end();
    });
  };
  ws.onmessage = e => {
    console.log('text:', e.data);
    phraseDiv.innerHTML += `<div>${e.data}</div>`;
  };
};

navigator.mediaDevices.getUserMedia({audio: true})
.then(init)
    .catch(console.log);
