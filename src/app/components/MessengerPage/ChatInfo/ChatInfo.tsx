import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import { Dialog } from 'app/store/dialogs/types';
import { OnlineBadge, OfflineBadge } from 'app/utils/statusBadge';
import { getInterlocutorInitials, getDialogInterlocutor } from '../../../utils/get-interlocutor';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { removeDialogAction, muteDialogAction } from 'app/store/dialogs/actions';
import { leaveConferenceAction, renameConferenceAction } from 'app/store/conferences/actions';
import { deleteFriendAction } from 'app/store/friends/actions';
import { markUserAsAddedToConferenceAction } from 'app/store/friends/actions';
import RenameConferenceModal from './RenameConferenceModal/RenameConferenceModal';
import { useActionWithDeferred } from 'app/utils/use-action-with-deferred';
import { addUsersToConferenceAction } from 'app/store/conferences/actions';
import Modal from '@material-ui/core/Modal';
import ChatActions from './ChatActions/ChatActions';
import { Messenger } from 'app/containers/Messenger/Messenger';
import './_ChatInfo.scss';
import { AppState } from 'app/store';

namespace ChatInfo {
  export interface Props {
    displayCreateChat: () => void;
    displayContactSearch: (action?: Messenger.contactSearchActions) => void;
  }
}

const ChatInfo = ({ displayCreateChat, displayContactSearch }: ChatInfo.Props) => {
  const selectedUserIds = useSelector<AppState, number[]>(
    (state: AppState) => state.friends.userIdsToAddIntoConference
  );
  const selectedDialog = useSelector(getSelectedDialogSelector) as Dialog;

  useEffect(() => {
    setInterval(() => console.log(selectedUserIds, selectedDialog), 2000);
  });

  const leaveConference = useActionWithDispatch(leaveConferenceAction);
  const removeDialog = useActionWithDispatch(removeDialogAction);
  const muteDialog = useActionWithDispatch(muteDialogAction);
  const deleteFriend = useActionWithDispatch(deleteFriendAction);
  const markUser = useActionWithDispatch(markUserAsAddedToConferenceAction);
  const renameConference = useActionWithDispatch(renameConferenceAction);
  const addUsersToConferece = useActionWithDeferred(addUsersToConferenceAction);

  const deleteChat = (): void => removeDialog(selectedDialog);
  const muteChat = (): void => muteDialog(selectedDialog);
  const deleteContact = (): void => deleteFriend(selectedDialog.interlocutor?.id || -1);
  const deleteConference = (): void => leaveConference(selectedDialog);
  const setNewConferenceName = (newName: string): void => renameConference({ newName, dialog: selectedDialog });
  const createConference = (): void => {
    markUser(selectedDialog.interlocutor?.id || -1);
    displayCreateChat();
  };
  const addUsers = () => {
    console.log(selectedUserIds);
    addUsersToConferece({ dialog: selectedDialog, userIds: selectedUserIds });
  };
  const searchContactsToAdd = () => {
    displayContactSearch({
      isDisplayed: true,
      isSelectable: true,
      onSubmit: () => addUsers(),
      displayMyself: false
    });
  };

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

    return (
      <div className="chat-info">
        <div className="chat-info__main-data">
          {!conference ? (
            interlocutor?.status === 1 ? (
              <OnlineBadge
                overlap="circle"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                variant="dot"
              >
                <Avatar src={getDialogAvatar()}>{getInterlocutorInitials(selectedDialog)}</Avatar>
              </OnlineBadge>
            ) : (
              <OfflineBadge
                overlap="circle"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                variant="dot"
              >
                <Avatar src={getDialogAvatar()}>{getInterlocutorInitials(selectedDialog)}</Avatar>
              </OfflineBadge>
            )
          ) : (
            <Avatar src={getDialogAvatar()}>{getInterlocutorInitials(selectedDialog)}</Avatar>
          )}
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
