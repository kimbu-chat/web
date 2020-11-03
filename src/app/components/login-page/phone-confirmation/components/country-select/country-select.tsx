import * as React from 'react';
import { useContext, useCallback, useEffect } from 'react';
import './country-select.scss';

import useAutocomplete, { createFilterOptions } from '@material-ui/lab/useAutocomplete';

import { countryList, Country } from '../../../../../common/countries';
import { LocalizationContext } from 'app/app';

import DownSvg from 'app/assets/icons/ic-chevron-down.svg';

namespace CountrySelect {
	export interface Props {
		country?: Country;
		setCountry: React.Dispatch<React.SetStateAction<Country>>;
		setPhone: (setNewPhone: ((oldPhone: string) => string) | string) => void;
		setRef: React.Dispatch<React.SetStateAction<React.RefObject<HTMLInputElement> | null>>;
		focusPhoneInput: () => void;
	}
}

const CountrySelect = ({ country, setCountry, setPhone, setRef, focusPhoneInput }: CountrySelect.Props) => {
	const { t } = useContext(LocalizationContext);

	const handleCountryChange = useCallback(
		(newCountry: Country) => {
			setCountry((oldCountry) => {
				setPhone((oldPhone) => {
					focusPhoneInput();
					if (oldCountry.title.length > 0) {
						const onlyNumber = oldPhone.split(' ').join('').split(oldCountry.number)[1];
						const newCode = newCountry ? newCountry.number : '';
						return onlyNumber ? newCode + onlyNumber : newCode;
					} else {
						return newCountry ? newCountry.number + oldPhone : '';
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

	const inputProps = getInputProps();

	useEffect(() => {
		//@ts-ignore
		setRef(inputProps.ref);
	}, []);

	return (
		<div {...getRootProps()} className='country-select'>
			<input placeholder={t('loginPage.country')} type='text' className='country-select__input' {...inputProps} />
			<DownSvg className='country-select__input-svg' />

			{groupedOptions.length > 0 ? (
				<div className='country-select__countries' {...getListboxProps()}>
					{groupedOptions.map(
						(option, index) =>
							option.number && (
								<div className='country-select__country' {...getOptionProps({ option, index })}>
									<span className='country-select__country-name'>{option.title}</span>
									<span className='country-select__number'>{option.number}</span>
								</div>
							),
					)}
				</div>
			) : null}
		</div>
	);
};

export default React.memo(CountrySelect, (prevProps, nextProps) => prevProps.country === nextProps.country);
