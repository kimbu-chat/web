import { countryList } from 'app/common/countries';

export const getCountry = async () => {
	const result = await fetch('https://ipapi.co/json/');

	if (result.ok) {
		const countryData = await result.json();

		const country =
			countryList.find(({ code }) => countryData.country_code === code) || countryList[countryList.length - 1];

		return country;
	}

	return countryList[0];
};
