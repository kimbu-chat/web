export const validateNickname = (value = '') => {
  const pattern = /^(?!_)(?!.*_$)[a-zA-Z0-9_]+$/;
  return !(!value || value.length < 5 || value.length > 25 || !value.match(pattern));
};
