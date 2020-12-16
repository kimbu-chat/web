export const validateNickname = (value: string) => {
  const pattern = /^[a-z0-9_]*$/;
  return !(!value || value.length < 5 || !value.match(pattern));
};
