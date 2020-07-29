import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';
import { Dialog } from 'app/store/dialogs/models';
import StatusBadge from 'app/utils/StatusBadge';
import { getInterlocutorInitials, getDialogInterlocutor } from '../../../utils/get-interlocutor';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import RenameConferenceModal from './RenameConferenceModal/RenameConferenceModal';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import Modal from '@material-ui/core/Modal';
import { Messenger } from 'app/containers/Messenger/Messenger';
import './_ChatInfo.scss';
import ChatMembers from './ChatMembers/ChatMembers';
import { AvatarSelectedData } from 'app/store/my-profile/models';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import { FriendActions } from 'app/store/friends/actions';

import { ChatActions as AppActions } from 'app/store/dialogs/actions';
import ChatActions from './ChatActions/ChatActions';

namespace ChatInfo {
  export interface Props {
    displayCreateChat: () => void;
    hideContactSearch: () => void;
    displayContactSearch: (action?: Messenger.contactSearchActions) => void;
    setImageUrl: (url: string | null | ArrayBuffer) => void;
    displayChangePhoto: (data: Messenger.photoSelect) => void;
    isDisplayed: boolean;
  }
}

const ChatInfo = ({
  displayCreateChat,
  displayContactSearch,
  hideContactSearch,
  setImageUrl,
  displayChangePhoto,
  isDisplayed
}: ChatInfo.Props) => {
  const selectedDialog = useSelector(getSelectedDialogSelector) as Dialog;

  const leaveConference = useActionWithDispatch(AppActions.leaveConference);
  const removeDialog = useActionWithDispatch(AppActions.removeChat);
  const muteDialog = useActionWithDispatch(AppActions.muteChat);
  const deleteFriend = useActionWithDispatch(FriendActions.deleteFriend);
  const markUser = useActionWithDispatch(FriendActions.markUserAsAddedToConference);
  const renameConference = useActionWithDispatch(AppActions.renameConference);
  const addUsersToConferece = useActionWithDeferred(AppActions.addUsersToConference);
  const changeConferenceAvatar = useActionWithDeferred(AppActions.changeConferenceAvatar);

  const deleteChat = (): void => removeDialog(selectedDialog);
  const muteChat = (): void => muteDialog(selectedDialog);
  const deleteContact = (): void => deleteFriend(selectedDialog.interlocutor?.id || -1);
  const deleteConference = (): void => leaveConference(selectedDialog);
  const setNewConferenceName = (newName: string): void => renameConference({ newName, dialog: selectedDialog });
  const createConference = (): void => {
    markUser(selectedDialog.interlocutor?.id || -1);
    displayCreateChat();
  };
  const addUsers = (userIds: number[]): void => {
    addUsersToConferece({ dialog: selectedDialog, userIds }).then(hideContactSearch);
  };
  const searchContactsToAdd = (args?: Messenger.optionalContactSearchActions) => {
    displayContactSearch({
      isDisplayed: true,
      isSelectable: true,
      onSubmit: addUsers,
      displayMyself: false,
      ...args
    });
  };
  const changeAvatar = (data: AvatarSelectedData) =>
    changeConferenceAvatar({ conferenceId: selectedDialog.conference?.id || -100, avatarData: data });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [renameConferenceOpened, setRenameConferenceOpened] = useState<boolean>(false);
  const openRenameConference = (): void => setRenameConferenceOpened(true);

  if (selectedDialog) {
    const { interlocutor, conference } = selectedDialog;

    const getDialogAvatar = (): string => {
      if (interlocutor) {
        return interlocutor.avatarUrl as string;
      }

      return conference?.avatarUrl as string;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      const reader = new FileReader();

      reader.onload = () => {
        setImageUrl(reader.result);
        displayChangePhoto({ onSubmit: changeAvatar });
      };

      if (e.target.files) reader.readAsDataURL(e.target.files[0]);
    };

    return (
      <div className={isDisplayed ? 'chat-info chat-info--active' : 'chat-info'}>
        <div className="chat-info__main-data">
          {!conference ? (
            <StatusBadge user={selectedDialog?.interlocutor!} />
          ) : (
            <div className="chat-info__avatar-group">
              <Avatar className="chat-info__avatar" src={getDialogAvatar()}>
                {getInterlocutorInitials(selectedDialog)}
              </Avatar>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={getDialogAvatar() ? 'change-avatar change-avatar--hidden' : 'change-avatar'}
              >
                <div className="svg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path
                      fillRule="evenodd"
                      d="M4.254 2.257A3.8 3.8 0 0 1 7.392.6h1.223c1.26 0 2.433.625 3.139 1.658l1.67.256A2.8 2.8 0 0 1 15.8 5.282V11a3.8 3.8 0 0 1-3.8 3.8H4A3.8 3.8 0 0 1 .2 11V5.282a2.8 2.8 0 0 1 2.376-2.768l1.678-.257zm.61 1.525l-2.046.314A1.2 1.2 0 0 0 1.8 5.282V11A2.2 2.2 0 0 0 4 13.2h8a2.2 2.2 0 0 0 2.2-2.2V5.282a1.2 1.2 0 0 0-1.018-1.186l-2.037-.312a.8.8 0 0 1-.572-.391l-.057-.1A2.2 2.2 0 0 0 8.615 2.2H7.392a2.2 2.2 0 0 0-1.91 1.107l-.046.081a.8.8 0 0 1-.573.394zM8 4.615A3.786 3.786 0 0 1 11.785 8.4 3.786 3.786 0 0 1 8 12.185 3.786 3.786 0 0 1 4.215 8.4 3.786 3.786 0 0 1 8 4.615zm0 1.6c-1.206 0-2.185.98-2.185 2.185 0 1.206.98 2.185 2.185 2.185 1.206 0 2.185-.98 2.185-2.185 0-1.206-.98-2.185-2.185-2.185z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          )}
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageChange(e)}
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
          />
          <span className="chat-info__interlocutor">{getDialogInterlocutor(selectedDialog)}</span>
        </div>
        <ChatActions
          deleteChat={deleteChat}
          deleteConference={deleteConference}
          muteChat={muteChat}
          deleteContact={deleteContact}
          createConference={createConference}
          openRenameConference={openRenameConference}
          displayContactSearch={searchContactsToAdd}
        />

        {conference && <ChatMembers addMembers={searchContactsToAdd} />}

        <Modal
          open={renameConferenceOpened}
          onClose={() => setRenameConferenceOpened(false)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div tabIndex={-1}>
            <RenameConferenceModal
              close={() => setRenameConferenceOpened(false)}
              renameConference={setNewConferenceName}
            />
          </div>
        </Modal>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default ChatInfo;
