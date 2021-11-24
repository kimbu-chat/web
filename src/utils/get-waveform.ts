import WaveSurfer from 'wavesurfer.js';
import { Peaks } from 'wavesurfer.js/types/backend';
import { WaveSurferParams } from 'wavesurfer.js/types/params';

import { IS_SAFARI } from '@utils/environment';

const DEFAULT_BAR_GAP = 3;

const DEFAULT_WAVE_SURFER_CONFIG = {
  waveColor: '#ffff',
  progressColor: '#3f8ae0',
  backgroundColor: 'transparent',
  cursorWidth: 0,
  height: 24,
  barWidth: 1,
  hideScrollbar: true,
  barRadius: 1,
  barGap: DEFAULT_BAR_GAP,
  barMinHeight: 1,
};

export const createWaveForm = (params?: WaveSurferParams): WaveSurfer => {
  let context;
  let processor;

  if (IS_SAFARI) {
    // Safari 11 or newer automatically suspends new AudioContext's that aren't
    // created in response to a user-gesture, like a click or tap, so create one
    // here (inc. the script processor)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    processor = context.createScriptProcessor(1024, 1, 1);
  }

  return WaveSurfer.create({
    container: document.createElement('div'),
    audioScriptProcessor: processor,
    audioContext: context,
    ...DEFAULT_WAVE_SURFER_CONFIG,
    ...params,
  });
};

export const getWaveform = (recordingUrl: string, seconds: number) =>
  new Promise<Peaks>((resolve) => {
    const waveSurferInstance = createWaveForm();

    waveSurferInstance?.load(recordingUrl);

    const onReady = () => {
      waveSurferInstance?.exportPCM(seconds * DEFAULT_BAR_GAP, undefined, true).then((waveForm) => {
        resolve(waveForm);
      });
    };

    waveSurferInstance?.on('ready', onReady);
  });
