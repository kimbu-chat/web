import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import { Dialog } from 'app/store/dialogs/types';
import { OnlineBadge, OfflineBadge } from 'app/utils/statusBadge';
import { getInterlocutorInitials, getDialogInterlocutor } from '../../../utils/get-interlocutor';
import ChatActions from './ChatActions/ChatActions';
import './_ChatInfo.scss';

const ChatInfo = () => {
  const selectedDialog = useSelector(getSelectedDialogSelector) as Dialog;
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
        <ChatActions />
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default ChatInfo;
