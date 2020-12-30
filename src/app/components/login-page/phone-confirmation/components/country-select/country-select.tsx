import * as React from 'react';
import { useContext, useEffect } from 'react';
import './country-select.scss';

import useAutocomplete, { createFilterOptions } from '@material-ui/lab/useAutocomplete';

import { LocalizationContext } from 'app/app';

import DownSvg from 'icons/ic-chevron-down.svg';
import { countryList, ICountry } from 'app/common/countries';

namespace CountrySelectNS {
  export interface IProps {
    country?: ICountry;
    handleCountryChange: (newCountry: ICountry) => void;
    setRef: React.Dispatch<React.SetStateAction<React.RefObject<HTMLInputElement> | null>>;
  }
}

export const CountrySelect = React.memo(
  ({ country, handleCountryChange, setRef }: CountrySelectNS.IProps) => {
    const { t } = useContext(LocalizationContext);

    const { getRootProps, getInputProps, getListboxProps, getOptionProps, groupedOptions, popupOpen } = useAutocomplete({
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
      setRef((inputProps as { ref: React.RefObject<HTMLInputElement> }).ref);
    }, []);

    return (
      <div {...getRootProps()} className='country-select'>
        <input placeholder={t('loginPage.country')} type='text' className='country-select__input' {...inputProps} />
        <DownSvg viewBox='0 0 25 25' className={`country-select__input-svg ${popupOpen ? 'country-select__input-svg--open' : ''}`} />

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
  },
  (prevProps, nextProps) => prevProps.country === nextProps.country,
);
