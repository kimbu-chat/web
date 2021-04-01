export const removeCountryCodeFromPhoneNumber = (countryCode: string, phone: string) => {
  let regex = '';
  const countryCodeArr = String(countryCode).split('');

  countryCodeArr.forEach((char) => {
    regex += `[${char}]\\s?`;
  });

  const replaceRegex = new RegExp(regex);

  return phone.replace(replaceRegex, '');
};
