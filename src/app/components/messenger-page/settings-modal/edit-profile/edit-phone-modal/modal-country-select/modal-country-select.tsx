import React, { useContext, useEffect } from 'react';
import { countryList } from 'app/common/countries';
import { ICountry } from 'app/common/country';
import './modal-country-select.scss';
import useAutocomplete, { createFilterOptions } from '@material-ui/lab/useAutocomplete';
import { LocalizationContext } from 'app/app';
import DownSvg from 'icons/ic-chevron-down.svg';

interface IModalCountrySelectProps {
  country?: ICountry;
  setRef: React.Dispatch<React.SetStateAction<React.RefObject<HTMLInputElement> | null>>;
  handleCountryChange: (newCountry: ICountry) => void;
}

export const ModalCountrySelect: React.FC<IModalCountrySelectProps> = React.memo(({ country, handleCountryChange, setRef }) => {
  const { t } = useContext(LocalizationContext);

  const { getRootProps, getInputProps, getListboxProps, getOptionProps, groupedOptions, popupOpen } = useAutocomplete({
    id: 'country-modal-autocomplete',
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
    setRef((inputProps as { ref: React.RefObject<HTMLInputElement> }).ref);
  }, [inputProps]);

  return (
    <div {...getRootProps()} className='modal-country-select'>
      <div className='modal-country-select__label'>{t('editPhoneModal.country')}</div>
      <div className={`modal-country-select__input-wrapper ${popupOpen ? 'modal-country-select__input-wrapper--acute' : ''}`}>
        <input placeholder={t('editPhoneModal.country')} type='text' className='modal-country-select__input' {...inputProps} />
        <DownSvg viewBox='0 0 25 25' className='modal-country-select__input-svg' />
        {groupedOptions.length > 0 ? (
          <div className='modal-country-select__countries' {...getListboxProps()}>
            {groupedOptions.map(
              (option, index) =>
                option.number && (
                  <div className='modal-country-select__country' {...getOptionProps({ option, index })}>
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
});
