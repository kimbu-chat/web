export async function getAudioVolume(stream: MediaStream, onVolumeChange: (volume: number) => void) {
  const audioContext = new AudioContext();
  await audioContext.audioWorklet.addModule('/vumeter-processor.js');
  const microphone = audioContext.createMediaStreamSource(stream);

  const node = new AudioWorkletNode(audioContext, 'vumeter');

  node.port.onmessage = (event) => {
    let volume = 0;
    const sensibility = 5;

    if (event.data.volume) {
      volume = event.data.volume;
    }

    onVolumeChange((volume * 100) / sensibility);
  };

  microphone.connect(node).connect(audioContext.destination);

  return () => {
    audioContext.close();
  };
}
