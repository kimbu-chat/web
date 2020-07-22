import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import { Dialog } from 'app/store/dialogs/types';
import StatusBadge from 'app/utils/StatusBadge';
import { getInterlocutorInitials, getDialogInterlocutor } from '../../../utils/get-interlocutor';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { removeDialogAction, muteDialogAction } from 'app/store/dialogs/actions';
import {
  leaveConferenceAction,
  renameConferenceAction,
  changeConferenceAvatarAction
} from 'app/store/conferences/actions';
import { deleteFriendAction } from 'app/store/friends/actions';
import { markUserAsAddedToConferenceAction } from 'app/store/friends/actions';
import RenameConferenceModal from './RenameConferenceModal/RenameConferenceModal';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { addUsersToConferenceAction } from 'app/store/conferences/actions';
import Modal from '@material-ui/core/Modal';
import ChatActions from './ChatActions/ChatActions';
import { Messenger } from 'app/containers/Messenger/Messenger';
import './_ChatInfo.scss';
import ChatMembers from './ChatMembers/ChatMembers';
import { AvatarSelectedData } from 'app/store/user/interfaces';

namespace ChatInfo {
  export interface Props {
    displayCreateChat: () => void;
    displayContactSearch: (action?: Messenger.contactSearchActions) => void;
    hideContactSearch: () => void;
    setImageUrl: (url: string | null | ArrayBuffer) => void;
    displayChangePhoto: (data: Messenger.photoSelect) => void;
  }
}

const ChatInfo = ({
  displayCreateChat,
  displayContactSearch,
  hideContactSearch,
  setImageUrl,
  displayChangePhoto
}: ChatInfo.Props) => {
  const selectedDialog = useSelector(getSelectedDialogSelector) as Dialog;

  const leaveConference = useActionWithDispatch(leaveConferenceAction);
  const removeDialog = useActionWithDispatch(removeDialogAction);
  const muteDialog = useActionWithDispatch(muteDialogAction);
  const deleteFriend = useActionWithDispatch(deleteFriendAction);
  const markUser = useActionWithDispatch(markUserAsAddedToConferenceAction);
  const renameConference = useActionWithDispatch(renameConferenceAction);
  const addUsersToConferece = useActionWithDeferred(addUsersToConferenceAction);
  const changeConferenceAvatar = useActionWithDeferred(changeConferenceAvatarAction);

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
      <div className="chat-info">
        <div className="chat-info__main-data">
          {!conference ? (
            <StatusBadge user={selectedDialog.interlocutor} />
          ) : (
            <Avatar onClick={() => fileInputRef.current?.click()} src={getDialogAvatar()}>
              {getInterlocutorInitials(selectedDialog)}
            </Avatar>
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
