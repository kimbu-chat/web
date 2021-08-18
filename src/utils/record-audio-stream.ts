let stream: MediaStream;

export const setRecordAudioStream = (newStream: MediaStream) => {
  stream = newStream;
};

export const getRecordAudioStream = (): MediaStream => stream;
