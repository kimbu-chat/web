import React from 'react';
import './ChatFromList.scss';
import { Dialog } from 'app/store/dialogs/types';
import * as moment from 'moment';
import { SystemMessageType, Message } from 'app/store/messages/interfaces';
import { MessageUtils } from 'app/utils/message-utils';
import { useSelector } from 'react-redux';
import { AppState } from 'app/store';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { changeSelectedDialogAction } from 'app/store/dialogs/actions';
import { useHistory } from 'react-router-dom';
import { getDialogInterlocutor, getInterlocutorInitials } from '../../../utils/get-interlocutor';
import { Avatar } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';

const OnlineBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}))(Badge);

const OfflineBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#b70015',
    color: '#b70015',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
  }
}))(Badge);

namespace ChatFromList {
  export interface Props {
    dialog: Dialog;
  }
}

const ChatFromList = ({ dialog }: ChatFromList.Props) => {
  const { interlocutor, lastMessage, conference } = dialog;
  const currentUserId: number = useSelector<AppState, number>((state) => state.auth.authentication.userId);
  const isMessageCreatorCurrentUser: boolean = lastMessage?.userCreator?.id === currentUserId;
  const changeSelectedDialog = useActionWithDispatch(changeSelectedDialogAction);
  let history = useHistory();

  const getDialogAvatar = (): string => {
    if (interlocutor) {
      return interlocutor.avatarUrl as string;
    }

    return conference?.avatarUrl as string;
  };

  const getMessageText = (): string => {
    const { lastMessage, conference } = dialog;
    if (lastMessage?.systemMessageType !== SystemMessageType.None) {
      return MessageUtils.constructSystemMessageText(
        lastMessage as Message,
        lastMessage?.userCreator?.id === currentUserId
      );
    }

    if (conference) {
      if (isMessageCreatorCurrentUser) {
        return `You: ${lastMessage.text}`;
      }
      return `${lastMessage.userCreator?.firstName}: ${lastMessage.text}`;
    }

    const shortedText = lastMessage.text.substr(0, 19);

    return shortedText;
  };

  const setSelectedDialog = (): void => {
    changeSelectedDialog(dialog.id);
    history.push(`/chats/${dialog.id}`);
  };

  return (
    <div
      onClick={setSelectedDialog}
      // activeClassName={'messenger__chat-block messenger__chat-block--active'}
      className="messenger__chat-block"
    >
      <div className="messenger__active-line"></div>
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
            <Avatar src={getDialogAvatar()}>{getInterlocutorInitials(dialog)}</Avatar>
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
            <Avatar src={getDialogAvatar()}>{getInterlocutorInitials(dialog)}</Avatar>
          </OfflineBadge>
        )
      ) : (
        <Avatar src={getDialogAvatar()}>{getInterlocutorInitials(dialog)}</Avatar>
      )}

      <div className="messenger__name-and-message">
        <div className="messenger__name">{getDialogInterlocutor(dialog)}</div>
        <div className="flat">
          {/* <img src={lastPhoto} alt="" className="messenger__last-photo" /> */}
          <div className="messenger__last-message">{getMessageText()}</div>
        </div>
      </div>
      <div className="messenger__time-and-count">
        <div className="messenger__time">{moment.utc(lastMessage?.creationDateTime).local().format('hh:mm')}</div>
        {/* <div className="messenger__count">{count}</div> */}
      </div>
    </div>
  );
};

export default ChatFromList;
