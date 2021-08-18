import { size } from 'lodash';

type Bar = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type WaveformData = {
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  width?: number;
  height?: number;
  bars?: Bar[];
  frequencyArray?: Float32Array;
  analyser?: AnalyserNode;
  audioContent?: AudioContext;
  destroyed?: boolean;
};

const waveformData: WaveformData = {};

const init = (element: HTMLElement) => {
  waveformData.canvas = document.createElement('canvas');
  waveformData.ctx = waveformData.canvas.getContext('2d') as CanvasRenderingContext2D;
  waveformData.width = element.clientWidth * 0.99;
  waveformData.height = 32;
  waveformData.canvas.width = waveformData.width * window.devicePixelRatio;
  waveformData.canvas.height = waveformData.height * window.devicePixelRatio;
  waveformData.canvas.style.width = `100%`;
  waveformData.canvas.style.height = `${waveformData.height}px`;
  waveformData.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  waveformData.destroyed = false;
  waveformData.bars = [];

  element.appendChild(waveformData.canvas);
};

const timeOffset = 100;
let now = Math.round(performance.now()) / timeOffset;

const loop = () => {
  waveformData.ctx?.clearRect(
    0,
    0,
    waveformData.canvas?.width ?? 0,
    waveformData.canvas?.height ?? 0,
  );
  let max = 0;

  if (Math.round(performance.now() / timeOffset) > now) {
    now = Math.round(performance.now() / timeOffset);
    if (waveformData.frequencyArray) {
      waveformData.analyser?.getFloatTimeDomainData(waveformData.frequencyArray);
      for (let i = 0; i < waveformData.frequencyArray.length; i += 1) {
        if (waveformData.frequencyArray[i] > max) {
          max = waveformData.frequencyArray[i];
        }
      }

      const freq = Math.floor(max * (waveformData.height ?? 0) * 5);
      const height = freq > 2 ? freq : 2;

      waveformData.bars?.push({
        x: 0,
        y: (waveformData.height ?? 0) / 2 - height / 2,
        height,
        width: 2,
      });
    }
  }

  if (!waveformData.destroyed) {
    draw();
    requestAnimationFrame(loop);
  }
};

const draw = () => {
  for (let i = 0; i < size(waveformData.bars); i += 1) {
    const bar: Bar | null = waveformData.bars ? waveformData.bars[i] : null;
    if (waveformData.ctx) {
      waveformData.ctx.fillStyle = `#3F8AE0`;
    }
    if (bar) {
      waveformData.ctx?.fillRect(bar.x, bar.y, bar.width, bar.height);
      bar.x += 1;

      if (waveformData.width && bar.x > waveformData.width) {
        waveformData.bars?.splice(i, 1);
      }
    }
  }
};

export const stopGenerating = () => {
  waveformData.bars = undefined;
  waveformData.frequencyArray = undefined;
  waveformData.analyser?.disconnect();
  waveformData.analyser = undefined;
  waveformData.audioContent?.close();
  waveformData.audioContent = undefined;
  waveformData.destroyed = true;
  waveformData.canvas?.parentNode?.removeChild(waveformData.canvas);
  waveformData.canvas = undefined;
  waveformData.ctx = undefined;
};

export const generateLiveWaveform = (stream: MediaStream, element: HTMLElement) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  waveformData.audioContent = new AudioContext();
  const streamSource = waveformData.audioContent.createMediaStreamSource(stream);

  waveformData.analyser = waveformData.audioContent.createAnalyser();
  streamSource.connect(waveformData.analyser);
  waveformData.analyser.fftSize = 512;
  waveformData.frequencyArray = new Float32Array(waveformData.analyser.fftSize);
  init(element);
  loop();
};
