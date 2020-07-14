import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import { Dialog } from 'app/store/dialogs/types';
import { OnlineBadge, OfflineBadge } from 'app/utils/statusBadge';
import { getInterlocutorInitials, getDialogInterlocutor } from '../../../utils/get-interlocutor';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { removeDialogAction, muteDialogAction } from 'app/store/dialogs/actions';
import { deleteFriendAction } from 'app/store/friends/actions';
import { markUserAsAddedToConferenceAction } from 'app/store/friends/actions';
import ChatActions from './ChatActions/ChatActions';
import './_ChatInfo.scss';

namespace ChatInfo {
  export interface Props {
    displayCreateChat: () => void;
  }
}

const ChatInfo = ({ displayCreateChat }: ChatInfo.Props) => {
  const selectedDialog = useSelector(getSelectedDialogSelector) as Dialog;
  //checking if it is conference another function will be called
  // const leaveConference = useActionWithDispatch(leaveConferenceAction);
  const removeDialog = useActionWithDispatch(removeDialogAction);
  const muteDialog = useActionWithDispatch(muteDialogAction);
  const deleteFriend = useActionWithDispatch(deleteFriendAction);
  const markUser = useActionWithDispatch(markUserAsAddedToConferenceAction);

  const deleteChat = () => removeDialog(selectedDialog);
  const muteChat = () => muteDialog(selectedDialog);
  const deleteContact = () => deleteFriend(selectedDialog.interlocutor?.id || -1);
  const createConference = () => {
    markUser(selectedDialog.interlocutor?.id || -1);
    displayCreateChat();
  };

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
          muteChat={muteChat}
          deleteContact={deleteContact}
          createConference={createConference}
        />
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default ChatInfo;
