import React from 'react';

import './ChatFromList.scss';
import { Dialog } from 'app/store/dialogs/types';
import * as moment from 'moment';
import { SystemMessageType, Message } from 'app/store/messages/interfaces';
import { MessageUtils } from 'app/utils/message-utils';
import { useSelector } from 'react-redux';
import { AppState } from 'app/store';
import { Avatar } from '@material-ui/core';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { changeSelectedDialogAction } from 'app/store/dialogs/actions';
import { useHistory } from "react-router-dom";

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
      return `${lastMessage.userCreator.firstName}: ${lastMessage.text}`;
    }

    const shortedText = lastMessage.text.substr(0, 19);

    return shortedText;
  };

  const getDialogInterlocutor = (): string => {
    const { interlocutor } = dialog;

    if (interlocutor) {
      const { firstName, lastName } = interlocutor;

      const interlocutorName = `${firstName} ${lastName}`;

      return interlocutorName;
    }

    return '';
  };

  const getInterlocutorInitials = (): string => {
    const initials = getDialogInterlocutor()
      .split(' ')
      .reduce((accum, current) => {
        return accum + current[0];
      }, '');

    const shortedInitials = initials.substr(0, 3);

    return shortedInitials;
  };

  const setSelectedDialog = (): void => {
    changeSelectedDialog(dialog.id);
    history.push(`/chats/${dialog.id}`)
  };

  return (
    <div onClick={setSelectedDialog}
      // activeClassName={'messenger__chat-block messenger__chat-block--active'}
      className="messenger__chat-block"
    >
      <div className="messenger__active-line"></div>
      <Avatar alt="Remy Sharp" src={getDialogAvatar()}>
        {getInterlocutorInitials()}
      </Avatar>
      <div className="messenger__name-and-message">
        <div className="messenger__name">{getDialogInterlocutor()}</div>
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
