const convertFloat32ToInt16 = buffer => {
    let l = buffer.length;
    const buf = new Int16Array(l);
    while (l--) {
        buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }
    return buf;
};

const reSample = (audioBuffer, targetSampleRate) => {
    const channel = audioBuffer.numberOfChannels;
    const samples = audioBuffer.length * targetSampleRate / audioBuffer.sampleRate;

    const offlineContext = new OfflineAudioContext(channel, samples, targetSampleRate);
    const bufferSource = offlineContext.createBufferSource();
    bufferSource.buffer = audioBuffer;

    bufferSource.connect(offlineContext.destination);
    bufferSource.start(0);
    return offlineContext.startRendering();
};

const concatTypedArrays = (a, b) => {
    const c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
};

export class Recorder {
    constructor(audioContext, stream, {targetSampleRate, recordStartLatency}) {
        const audioInput = audioContext.createMediaStreamSource(stream);
        const recorder = audioContext.createScriptProcessor(0, 1, 1);
        audioInput.connect(recorder, 0, 0);
        recorder.connect(audioContext.destination);

        this.state = {
            isRecording: false,
            record: null,
            recordIsPending: false,
        };
        const state = this.state;
        recorder.onaudioprocess = audioEvent => {
           reSample(audioEvent.inputBuffer, targetSampleRate)
               .then(resampledBuffer => {
                   const chunk = convertFloat32ToInt16(resampledBuffer.getChannelData(0));
                   const numChunksToKeep = Math.ceil(targetSampleRate * recordStartLatency / chunk.length);
                   if (state.record && state.isRecording) {
                       state.record = concatTypedArrays(state.record, chunk);
                   } else if (state.record) {
                       const chunksToKeep = state.record.slice(Math.max(0, state.record.length - chunk.length * numChunksToKeep));
                       state.record = concatTypedArrays(chunksToKeep, chunk);
                   } else {
                       state.record = chunk;
                   }
                   if (state.recordIsPending) {
                       state.recordIsPending = false;
                       state.isRecording = false;
                       if (this.onRecord) {
                           this.onRecord(state.record);
                       }
                   }
               });
        };
    }
    start() {
        this.state.isRecording = true;
    }
    end() {
        this.state.recordIsPending = true;
    }
    onRecord(recordHandler) {
        this.onRecord = recordHandler;
    }
}
