import React from 'react';

export type CurrentAudio = { chatId: string; audioId: number } | null;

export const AudioContext = React.createContext<{
  currentAudio?: CurrentAudio;
  changeAudio?: (audioId: number) => void;
  isPlayingAudio?: boolean;
  toggleAudio?: () => void;
}>({});
