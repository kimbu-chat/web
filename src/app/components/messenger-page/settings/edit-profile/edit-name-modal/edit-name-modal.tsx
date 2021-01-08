import { LocalizationContext } from 'app/app';
import { Modal, WithBackground } from 'components';
import { MyProfileActions } from 'store/my-profile/actions';
import { getMyProfileSelector } from 'store/my-profile/selectors';
import { useActionWithDeferred } from 'app/hooks/use-action-with-deferred';
import React, { useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import './edit-name-modal.scss';

interface IEditNameModalProps {
  onClose: () => void;
}

export const EditNameModal: React.FC<IEditNameModalProps> = React.memo(({ onClose }) => {
  const myProfile = useSelector(getMyProfileSelector);

  const { t } = useContext(LocalizationContext);

  const updateMyProfile = useActionWithDeferred(MyProfileActions.updateMyProfileAction);

  const [firstName, setFirstName] = useState(myProfile?.firstName || '');
  const [lastName, setLastName] = useState(myProfile?.lastName || '');

  const changeFirstName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFirstName(event.target.value);
    },
    [setFirstName],
  );
  const changeLastName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLastName(event.target.value);
    },
    [setLastName],
  );

  const onSubmit = useCallback(() => {
    if (firstName !== myProfile?.firstName || lastName !== myProfile?.lastName) {
      updateMyProfile({ firstName, lastName, nickname: myProfile!.nickname, avatar: myProfile?.avatar });
    }
    onClose();
  }, [firstName, lastName, updateMyProfile, myProfile]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={t('editNameModal.edit_name')}
        closeModal={onClose}
        content={
          <div className='edit-name-modal'>
            <div className='edit-name-modal__input-block'>
              <span className='edit-name-modal__input-label'>{t('editNameModal.first_name')}</span>
              <input value={firstName} onChange={changeFirstName} type='text' className='edit-name-modal__input' />
            </div>
            <div className='edit-name-modal__input-block'>
              <span className='edit-name-modal__input-label'>{t('editNameModal.last_name')}</span>
              <input value={lastName} onChange={changeLastName} type='text' className='edit-name-modal__input' />
            </div>
          </div>
        }
        buttons={[
          {
            children: 'Save',
            className: 'edit-name-modal__confirm-btn',
            onClick: onSubmit,
            position: 'left',
            width: 'contained',
            variant: 'contained',
            color: 'primary',
          },
        ]}
      />
    </WithBackground>
  );
});
