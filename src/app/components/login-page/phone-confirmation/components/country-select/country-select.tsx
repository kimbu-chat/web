import * as React from 'react';
import { useContext, useEffect } from 'react';
import './country-select.scss';

import useAutocomplete, { createFilterOptions } from '@material-ui/lab/useAutocomplete';

import { countryList, Country } from '../../../../../common/countries';
import { LocalizationContext } from 'app/app';

import DownSvg from 'icons/ic-chevron-down.svg';

namespace CountrySelect {
	export interface Props {
		country?: Country;
		handleCountryChange: (newCountry: Country) => void;
		setRef: React.Dispatch<React.SetStateAction<React.RefObject<HTMLInputElement> | null>>;
	}
}

const CountrySelect = ({ country, handleCountryChange, setRef }: CountrySelect.Props) => {
	const { t } = useContext(LocalizationContext);

	const { getRootProps, getInputProps, getListboxProps, getOptionProps, groupedOptions, popupOpen } = useAutocomplete(
		{
			id: 'use-autocomplete-demo',
			options: countryList,
			getOptionLabel: (option) => option.title,
			value: country,
			onChange: (_event, newCountry) => handleCountryChange(newCountry!),
			filterOptions: createFilterOptions({
				stringify: (option) => option.title + option.number,
			}),
		},
	);

	const inputProps = getInputProps();

	useEffect(() => {
		setRef((inputProps as { ref: React.RefObject<HTMLInputElement> }).ref);
	}, []);

	return (
		<div {...getRootProps()} className='country-select'>
			<input placeholder={t('loginPage.country')} type='text' className='country-select__input' {...inputProps} />
			<DownSvg
				viewBox='0 0 25 25'
				className={`country-select__input-svg ${popupOpen ? 'country-select__input-svg--open' : ''}`}
			/>

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
