import * as React from 'react';
import { useContext, useCallback, useState } from 'react';
import './country-select.scss';

import useAutocomplete, { createFilterOptions } from '@material-ui/lab/useAutocomplete';

import { countryList, country } from '../../../common/countries';
import { LocalizationContext } from 'app/app';

namespace CountrySelect {
	export interface Props {
		country: country | null;
		setCountry: (setNewCountry: (oldCountry: country | null) => country | null) => void;
		setPhone: (setNewPhone: ((oldPhone: string) => string) | string) => void;
	}
}

// function countryToFlag(isoCode: string): string {
// 	return typeof String.fromCodePoint !== 'undefined'
// 		? isoCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
// 		: isoCode;
// }

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

	const { getRootProps, getInputProps, getListboxProps, getOptionProps, groupedOptions } = useAutocomplete({
		id: 'use-autocomplete-demo',
		options: countryList,
		inputValue: inputValue,
		onInputChange: (_event, newInputValue) => {
			setInputValue(newInputValue);
			console.log(newInputValue);
		},
		getOptionLabel: (option) => option.title,
		value: country,
		onChange: (_event, newCountry) => handleCountryChange(newCountry),
		filterOptions: createFilterOptions({
			stringify: (option) => option.title + option.number,
		}),
	});

	return (
		<div {...getRootProps()} className=''>
			<input
				placeholder={t('loginPage.country')}
				list='countries'
				type='text'
				className='country-select'
				{...getInputProps()}
			/>

			{groupedOptions.length > 0 ? (
				<datalist id='countries' {...getListboxProps()}>
					{groupedOptions.map((option, index) => {
						console.log(option);
						return (
							<option className='country-select__country' {...getOptionProps({ option, index })}>
								{option.title}
							</option>
						);
					})}
				</datalist>
			) : null}
		</div>
	);
};

export default React.memo(CountrySelect, (prevProps, nextProps) => prevProps.country === nextProps.country);
