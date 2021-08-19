import WaveSurfer from 'wavesurfer.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone';
import { Peaks } from 'wavesurfer.js/types/backend';

export const getWaveform = (recordingUrl: string) =>
  new Promise<Peaks>((resolve) => {
    let context;
    let processor;

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
      // Safari 11 or newer automatically suspends new AudioContext's that aren't
      // created in response to a user-gesture, like a click or tap, so create one
      // here (inc. the script processor)
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      context = new AudioContext();
      processor = context.createScriptProcessor(1024, 1, 1);
    }

    const waveSurferInstance = WaveSurfer.create({
      container: document.createElement('div'),
      waveColor: '#3f8ae0',
      interact: false,
      cursorWidth: 0,
      plugins: [MicrophonePlugin.create()],
      audioScriptProcessor: processor,
      audioContext: context,
      height: 30,
      hideScrollbar: true,
    });

    waveSurferInstance?.load(recordingUrl);

    const onReady = () => {
      waveSurferInstance?.exportPCM(5, undefined, true).then((waveForm) => {
        resolve(waveForm);
      });
    };

    waveSurferInstance?.on('ready', onReady);
  });
