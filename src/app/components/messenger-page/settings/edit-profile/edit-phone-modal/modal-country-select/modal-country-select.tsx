import React, { useCallback, useContext, useEffect } from 'react';
import { country, countryList } from 'app/common/countries';
import './modal-country-select.scss';
import { useAutocomplete, createFilterOptions } from '@material-ui/lab';
import { LocalizationContext } from 'app/app';
import DownSvg from 'app/assets/icons/ic-chevron-down.svg';

namespace ModalCountrySelect {
	export interface Props {
		country?: country;
		setCountry: React.Dispatch<React.SetStateAction<country>>;
		setPhone: (setNewPhone: ((oldPhone: string) => string) | string) => void;
		setRef: React.Dispatch<React.SetStateAction<React.RefObject<HTMLInputElement> | null>>;
		focusPhoneInput: () => void;
	}
}

const ModalCountrySelect = ({ country, setCountry, setPhone, setRef, focusPhoneInput }: ModalCountrySelect.Props) => {
	const { t } = useContext(LocalizationContext);

	const handleCountryChange = useCallback(
		(newCountry: country) => {
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
		//@ts-ignore
		setRef(inputProps.ref);
	}, [inputProps]);

	return (
		<div {...getRootProps()} className='modal-country-select'>
			<div className='modal-country-select__label'>Country</div>
			<div
				className={`modal-country-select__input-wrapper ${
					popupOpen ? 'modal-country-select__input-wrapper--acute' : ''
				}`}
			>
				<input placeholder={t('country')} type='text' className='modal-country-select__input' {...inputProps} />
				<DownSvg viewBox='0 0 25 25' className='modal-country-select__input-svg' />
				{groupedOptions.length > 0 ? (
					<div className='modal-country-select__countries' {...getListboxProps()}>
						{groupedOptions.map(
							(option, index) =>
								option.number && (
									<div
										className='modal-country-select__country'
										{...getOptionProps({ option, index })}
									>
										<span className='modal-country-select__country-name'>{option.title}</span>
										<span className='modal-country-select__number'>{option.number}</span>
									</div>
								),
						)}
					</div>
				) : (
					false
				)}
			</div>
		</div>
	);
};

export default ModalCountrySelect;
