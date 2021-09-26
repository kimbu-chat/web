import React from 'react';

export type CurrentAudio = { chatId: number; audioId: number } | null;

export const AudioContext = React.createContext<{
  currentAudio?: CurrentAudio;
  changeAudio?: (audioId: number) => void;
  isPlayingAudio?: boolean;
  toggleAudio?: () => void;
}>({});
