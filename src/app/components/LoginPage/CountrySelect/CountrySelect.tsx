import * as React from 'react';
import { useContext, useCallback, useState } from 'react';
import './CountrySelect.scss';

import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

import { countryList, country } from '../../../utils/countries';
import { LocalizationContext } from 'app/app';

namespace CountrySelect {
	export interface Props {
		country: country | null;
		setCountry: (setNewCountry: (oldCountry: country | null) => country | null) => void;
		setPhone: (setNewPhone: ((oldPhone: string) => string) | string) => void;
	}
}

function countryToFlag(isoCode: string): string {
	return typeof String.fromCodePoint !== 'undefined'
		? isoCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
		: isoCode;
}

const CountrySelect = ({ country, setCountry, setPhone }: CountrySelect.Props) => {
	const { t } = useContext(LocalizationContext);
	const [inputValue, setInputValue] = useState('');

	const handleCountryChange = useCallback(
		(newCountry: country | null) => {
			setCountry((oldCountry) => {
				setPhone((oldPhone) => {
					if (typeof oldCountry === 'object') {
						const onlyNumber = oldPhone
							.split(' ')
							.join('')
							.split(oldCountry ? oldCountry.number : '')[1];
						const preparedNumber = newCountry?.number + onlyNumber ? onlyNumber : '';
						const newCode = newCountry ? newCountry.number : '';
						return preparedNumber ? preparedNumber : newCode;
					} else {
						return newCountry ? newCountry.number : '';
					}
				});
				return newCountry ? newCountry : countryList[0];
			});
		},
		[setCountry, setPhone],
	);

	return (
		<Autocomplete
			value={country}
			className='country-select'
			onChange={(_event, newCountry) => handleCountryChange(newCountry)}
			inputValue={inputValue}
			onInputChange={(_event, newInputValue) => {
				setInputValue(newInputValue);
			}}
			options={countryList}
			getOptionLabel={(option) => option.title}
			renderOption={(option) => (
				<div className='country-select__country'>
					<span className='country-select__flag'>{countryToFlag(option.code)}</span>
					{option.title} <span className='country-select__number'>{option.number}</span>
				</div>
			)}
			renderInput={(params) => (
				<TextField
					{...params}
					label={t('loginPage.country')}
					variant='outlined'
					inputProps={{
						...params.inputProps,
						autoComplete: 'new-password',
					}}
				/>
			)}
			filterOptions={createFilterOptions({
				stringify: (option) => option.title + option.number,
			})}
		/>
	);
};

export default React.memo(CountrySelect, (prevProps, nextProps) => prevProps.country === nextProps.country);
