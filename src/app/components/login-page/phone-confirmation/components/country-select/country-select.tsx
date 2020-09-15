import * as React from 'react';
import { useContext, useCallback } from 'react';
import './country-select.scss';

import useAutocomplete, { createFilterOptions } from '@material-ui/lab/useAutocomplete';

import { countryList, country } from '../../../../../common/countries';
import { LocalizationContext } from 'app/app';

namespace CountrySelect {
	export interface Props {
		country?: country;
		setCountry: React.Dispatch<React.SetStateAction<country>>;
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

	const handleCountryChange = useCallback(
		(newCountry: country) => {
			setCountry((oldCountry) => {
				setPhone((oldPhone) => {
					if (typeof oldCountry === 'object') {
						const onlyNumber = oldPhone
							.split(' ')
							.join('')
							.split(oldCountry ? oldCountry.number : '')[1];
						const newCode = newCountry ? newCountry.number : oldCountry?.number || '';
						return onlyNumber ? newCode + onlyNumber : newCode;
					} else {
						return newCountry ? newCountry.number : '';
					}
				});
				return newCountry ? newCountry : oldCountry;
			});
		},
		[setCountry, setPhone],
	);

	const { getRootProps, getInputProps, getListboxProps, getOptionProps, groupedOptions } = useAutocomplete({
		id: 'use-autocomplete-demo',
		options: countryList,
		getOptionLabel: (option) => option.title,
		value: country,
		onChange: (_event, newCountry) => handleCountryChange(newCountry!),
		filterOptions: createFilterOptions({
			stringify: (option) => option.title + option.number,
		}),
	});

	return (
		<div {...getRootProps()} className='country-select'>
			<input
				placeholder={t('loginPage.country')}
				type='text'
				className='country-select__input'
				{...getInputProps()}
			/>

			{groupedOptions.length > 0 ? (
				<div className='country-select__countries' {...getListboxProps()}>
					{groupedOptions.map(
						(option, index) =>
							option.number && (
								<div className='country-select__country' {...getOptionProps({ option, index })}>
									<span className='country-select__flag'>{countryToFlag(option.code)}</span>
									{option.title} <span className='country-select__number'>{option.number}</span>
								</div>
							),
					)}
				</div>
			) : null}
		</div>
	);
};

export default React.memo(CountrySelect, (prevProps, nextProps) => prevProps.country === nextProps.country);
