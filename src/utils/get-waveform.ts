import WaveSurfer from 'wavesurfer.js';
import { Peaks } from 'wavesurfer.js/types/backend';

export const getWaveform = (recordingUrl: string, seconds: number) =>
  new Promise<Peaks>((resolve) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    let context;
    let processor;

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
      waveColor: '#ffff',
      progressColor: '#3f8ae0',
      backgroundColor: 'transparent',
      cursorWidth: 0,
      height: 24,
      barWidth: 1,
      audioScriptProcessor: processor,
      audioContext: context,
      hideScrollbar: true,
      barRadius: 1,
      barGap: 3,
      barMinHeight: 1,
    });

    waveSurferInstance?.load(recordingUrl);

    const onReady = () => {
      waveSurferInstance?.exportPCM(seconds * 3, undefined, true).then((waveForm) => {
        resolve(waveForm);
      });
    };

    waveSurferInstance?.on('ready', onReady);
  });
