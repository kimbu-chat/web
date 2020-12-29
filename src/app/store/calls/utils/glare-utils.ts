export let makingOffer = false;
export let ignoreOffer = false;
export let isSettingRemoteAnswerPending = false;

export const setMakingOffer = (newValue: boolean) => {
  makingOffer = newValue;
};
export const setIgnoreOffer = (newValue: boolean) => {
  ignoreOffer = newValue;
};
export const setIsSettingRemoteAnswerPending = (newValue: boolean) => {
  isSettingRemoteAnswerPending = newValue;
};

// renegotiation

export let isRenegotiationAccepted = true;

export const setIsRenegotiationAccepted = (newValue: boolean) => {
  isRenegotiationAccepted = newValue;
};
