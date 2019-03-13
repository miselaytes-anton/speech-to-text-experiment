# Speech to text experiment

A client-server setup for speech recognition using [Mozilla Deep Speech](https://github.com/mozilla/DeepSpeech) project.

## Setup

### Get the pre-trained models
```console
wget https://github.com/mozilla/DeepSpeech/releases/download/v0.4.1/deepspeech-0.4.1-models.tar.gz
tar xvfz deepspeech-0.4.1-models.tar.gz 
```

### Start the app
```console
npm i
npm run dev:server
npm run dev:client
```

Now you can open https://localhost:8080 in Chrome with [unsafe localhost flag](https://superuser.com/questions/772762/how-can-i-disable-security-checks-for-localhost)

## Limitations

- Based on my tests its only works well with really simple commands, e.g. `left`, `right`, `yes`, `no` etc.
- We need to use HTTPS for audio input and web sockets. And since we use self-signed certificates, this only works in Chrome with [unsafe localhost flag](https://superuser.com/questions/772762/how-can-i-disable-security-checks-for-localhost).
- It seems that Deep Speech only works well with a single audio file being transcribed at a time, so using multiple clients lowers the quality of recognition
- We need to down sample audio from 41000 to 16000 which lowers the quality of recognition
- Looks like the model only works well with native english speakers at the moment
- Perfomance is not that great 
