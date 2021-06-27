export enum Origin {
  AudioPlayer,
  Record,
}

let current: { id: number; endAudio: () => void; origin: Origin } | null = null;

export const changeMusic = (id: number, origin: Origin, endAudio: () => void) => {
  if (id !== current?.id) {
    if (!(origin === Origin.AudioPlayer && current?.origin === Origin.AudioPlayer))
      current?.endAudio();
  } else {
    current = null;
  }

  current = {
    id,
    origin,
    endAudio,
  };
};

export function playSoundSafely(sound: HTMLAudioElement): void {
  sound.play().catch(() => {
    // Autoplay was prevented.
  });
}
