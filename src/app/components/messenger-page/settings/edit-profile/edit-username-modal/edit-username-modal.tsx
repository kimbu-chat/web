import { WithBackground, Modal } from 'components';
import { getMyProfileSelector } from 'store/my-profile/selectors';
import React, { useContext, useState, useCallback } from 'react';

import { useSelector } from 'react-redux';
import ValidSvg from 'icons/ic-check-filled.svg';
import InValidSvg from 'icons/ic-dismiss.svg';
import './edit-username-modal.scss';
import { MyProfileActions } from 'store/my-profile/actions';
import { useActionWithDeferred } from 'app/hooks/use-action-with-deferred';
import { LocalizationContext } from 'app/app';
import { validateNickname } from 'app/utils/validate-nick-name';

interface IEditUserNameModalProps {
  onClose: () => void;
}

export const EditUserNameModal: React.FC<IEditUserNameModalProps> = React.memo(({ onClose }) => {
  const { t } = useContext(LocalizationContext);

  const [isNickNameAvailable, setIsNickNameAvailable] = useState(true);
  const [isNickNameValid, setIsNickNameValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const myProfile = useSelector(getMyProfileSelector);

  const updateMyNickname = useActionWithDeferred(MyProfileActions.updateMyNicknameAction);
  const checkNicknameAvailability = useActionWithDeferred(MyProfileActions.checkNicknameAvailabilityAction);

  const [nickname, setNickname] = useState(myProfile?.nickname || '');

  const onChangeNickname = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newNickName = event.target.value;
      setNickname(newNickName);

      if (newNickName === myProfile?.nickname) {
        setIsNickNameAvailable(true);
        return;
      }

      if (validateNickname(newNickName)) {
        setIsNickNameValid(true);

        setIsLoading(true);
        checkNicknameAvailability({ nickname: newNickName }).then(({ isAvailable }) => {
          setIsNickNameAvailable(isAvailable);
          setIsLoading(false);
        });
      } else {
        setIsNickNameValid(false);
      }
    },
    [setNickname, setIsNickNameAvailable, checkNicknameAvailability, setIsLoading, setIsNickNameValid],
  );

  const onSubmit = useCallback(() => {
    if (nickname !== myProfile?.nickname) {
      updateMyNickname({ nickname });
    }
    onClose();
  }, [nickname, updateMyNickname, myProfile]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={t('editUsernameModal.edit_username')}
        closeModal={onClose}
        content={
          <div className='edit-username-modal'>
            <div className='edit-username-modal__input-block'>
              <span className='edit-username-modal__input-label'>{t('editUsernameModal.username')}</span>
              {!isNickNameValid && <div>This nick name is not acceptable</div>}
              <div className='edit-username-modal__input-wrapper'>
                <input value={nickname} onChange={onChangeNickname} type='text' className='edit-username-modal__input' />
                {isNickNameValid && isNickNameAvailable && (
                  <div className='edit-username-modal__valid'>
                    <ValidSvg viewBox='0 0 25 25' />
                  </div>
                )}
                {(!isNickNameValid || !isNickNameAvailable) && (
                  <div className='edit-username-modal__invalid'>
                    <InValidSvg viewBox='0 0 25 25' />
                  </div>
                )}
              </div>
            </div>
            <span className='edit-username-modal__requirements'>{t('editUsernameModal.requirements')}</span>
          </div>
        }
        buttons={[
          {
            children: 'Save',
            className: 'edit-username-modal__confirm-btn',
            disabled: !isNickNameAvailable || isLoading || !isNickNameValid,
            onClick: onSubmit,
            position: 'left',
            width: 'contained',
            variant: 'contained',
            isLoading,
            color: 'primary',
          },
        ]}
      />
    </WithBackground>
  );
});
