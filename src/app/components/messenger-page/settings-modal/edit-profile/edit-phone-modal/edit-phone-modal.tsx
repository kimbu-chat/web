import { LocalizationContext } from 'app/app';
import { countryList } from 'app/common/countries';
import { ICountry } from 'app/common/country';
import { Modal, WithBackground } from 'components';
import { parsePhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import './edit-phone-modal.scss';
import { myPhoneNumberSelector } from 'app/store/my-profile/selectors';
import { ModalCountrySelect } from './modal-country-select/modal-country-select';
import { ModalPhoneInput } from './modal-phone-input/modal-phone-input';

interface IEditPhoneModalProps {
  onClose: () => void;
}

export const EditPhoneModal: React.FC<IEditPhoneModalProps> = React.memo(({ onClose }) => {
  const { t } = useContext(LocalizationContext);

  const currentNumber = useSelector(myPhoneNumberSelector);
  const currentNumberCountry = parsePhoneNumber(currentNumber!).country;

  const [country, setCountry] = useState<ICountry>(countryList.find(({ code }) => currentNumberCountry === code)!);
  const [phone, setPhone] = useState<string>('');
  const [countrySelectRef, setCountrySelectRef] = useState<React.RefObject<HTMLInputElement> | null>(null);

  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCountry(countryList.find(({ code }) => currentNumberCountry === code)!);
  }, []);

  const sendSms = useCallback(() => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const phoneNumber = parsePhoneNumberFromString(phone);
  }, [phone]);

  const displayCountries = useCallback(() => {
    countrySelectRef?.current?.focus();
    const clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent('mousedown', true, true);
    countrySelectRef?.current?.dispatchEvent(clickEvent);
  }, [countrySelectRef]);

  const focusPhoneInput = useCallback(() => {
    phoneInputRef.current?.focus();
  }, [phoneInputRef]);

  const handleCountryChange = useCallback(
    (newCountry: ICountry) => {
      setCountry((oldCountry) => {
        setPhone((oldPhone) => {
          focusPhoneInput();
          if (oldCountry.title.length > 0) {
            const onlyNumber = oldPhone.split(' ').join('').split(oldCountry.number)[1];
            const newCode = newCountry ? newCountry.number : '';
            return onlyNumber ? newCode + onlyNumber : newCode;
          }
          return newCountry ? newCountry.number + oldPhone : '';
        });
        return newCountry || oldCountry;
      });
    },
    [setCountry, setPhone, focusPhoneInput],
  );

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={t('editPhoneModal.edit_phone')}
        closeModal={onClose}
        content={
          <div className='edit-phone-modal'>
            <ModalCountrySelect setRef={setCountrySelectRef} country={country} handleCountryChange={handleCountryChange} />
            <ModalPhoneInput ref={phoneInputRef} displayCountries={displayCountries} country={country} phone={phone} setPhone={setPhone} sendSms={sendSms} />
          </div>
        }
        buttons={[
          <button type='button' className='edit-phone-modal__confirm-btn'>
            Save
          </button>,
        ]}
      />
    </WithBackground>
  );
});
