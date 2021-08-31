export const validateNickname = (value = '') => {
  const pattern = /^[a-z0-9_]*$/;
  return !(!value || value.length < 5 || value.length > 25 || !value.match(pattern));
};
