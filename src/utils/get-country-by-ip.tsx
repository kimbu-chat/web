export const getCountryByIp = async () => {
  const result = await fetch('https://ipapi.co/json/');

  if (result.ok) {
    const countryData = await result.json();

    return countryData.country_code as string;
  }

  return '';
};
