import React, { useContext, useState } from 'react';
import AddContactSvg from 'icons/add-users.svg';
import './add-friend-modal.scss';
import { LocalizationContext } from 'app/app';
import { WithBackground, Modal } from 'app/components';
import { PhoneInputGroup } from 'app/components/messenger-page/shared/phone-input-group/phone-input-group';

interface IAddFriendModalProps {
  onClose: () => void;
}

export const AddFriendModal: React.FC<IAddFriendModalProps> = ({ onClose }) => {
  const { t } = useContext(LocalizationContext);

  const [phone, setPhone] = useState('');

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={
          <>
            <AddContactSvg className='add-friends-modal__icon' viewBox='0 0 18 18' />
            <span> {t('addFriendModal.title')} </span>
          </>
        }
        content={
          <div className='add-friends-modal'>
            <PhoneInputGroup phone={phone} setPhone={setPhone} />
          </div>
        }
        closeModal={onClose}
        buttons={[
          <button type='button' className='add-friends-modal__btn add-friends-modal__btn--cancel' onClick={onClose}>
            {t('addFriendModal.cancel')}
          </button>,
          <button type='button' className='add-friends-modal__btn add-friends-modal__btn--confirm' onClick={() => console.log('find')}>
            {t('addFriendModal.find')}
          </button>,
        ]}
      />
    </WithBackground>
  );
};
