import React from 'react';

import './ChatFromList.scss';
import { Dialog } from 'app/store/dialogs/types';
import * as moment from 'moment';
import { SystemMessageType, Message } from 'app/store/messages/types';
import { MessageUtils } from 'app/utils/message-utils';
import { useSelector } from 'react-redux';
import { AppState } from 'app/store';
import { Avatar } from '@material-ui/core';

namespace ChatFromList {
  export interface Props {
    dialog: Dialog;
  }
}

const ChatFromList = ({ dialog }: ChatFromList.Props) => {
  const { interlocutor, lastMessage, conference } = dialog;
  const currentUserId: number = useSelector<AppState, number>((state) => state.auth.currentUser?.id as number);
  const isMessageCreatorCurrentUser: boolean = lastMessage?.userCreator?.id === currentUserId;

  const getDialogAvatar = (): string => {
    if (interlocutor) {
      return interlocutor.avatarUrl as string;
    }

    return conference?.avatarUrl as string;
  };

  const getMessageText = (): string => {
    const { lastMessage, conference } = dialog;
    if (lastMessage?.systemMessageType !== SystemMessageType.None) {
      return MessageUtils.constructSystemMessageText(lastMessage as Message, lastMessage?.userCreator?.id === currentUserId);
    }

    if (conference) {
      if (isMessageCreatorCurrentUser) {
        return `You: ${lastMessage.text}`;
      }
      return `${lastMessage.userCreator.firstName}: ${lastMessage.text}`;
    }

    return lastMessage.text;
  };

  return (
    <button className="messenger__chat-block">
      <div className="messenger__active-line"></div>
      <Avatar alt="Remy Sharp" src={getDialogAvatar()}>
        B
      </Avatar>
      {/* <img src={getDialogAvatar()} alt="" className="messenger__chat-img" /> */}
      <div className="messenger__name-and-message">
        <div className="messenger__name">{name}</div>
        <div className="flat">
          {/* <img src={lastPhoto} alt="" className="messenger__last-photo" /> */}
          <div className="messenger__last-message">{getMessageText()}</div>
        </div>
      </div>
      <div className="messenger__time-and-count">
        <div className="messenger__time">{moment.utc(lastMessage?.creationDateTime).local().format('hh:mm')}</div>
        {/* <div className="messenger__count">{count}</div> */}
      </div>
    </button>
  );
};

export default ChatFromList;
