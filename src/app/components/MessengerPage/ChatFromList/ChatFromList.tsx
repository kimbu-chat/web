import React from 'react';
import './ChatFromList.scss';
import { Dialog } from 'app/store/dialogs/types';
import * as moment from 'moment';
import { useSelector } from 'react-redux';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import { SystemMessageType, Message } from 'app/store/messages/interfaces';
import { MessageUtils } from 'app/utils/message-utils';
import { AppState } from 'app/store';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { changeSelectedDialogAction } from 'app/store/dialogs/actions';
import { useHistory } from 'react-router-dom';
import { getDialogInterlocutor, getInterlocutorInitials } from '../../../utils/get-interlocutor';
import { Avatar } from '@material-ui/core';
import { OnlineBadge, OfflineBadge } from 'app/utils/statusBadge';
import _ from 'lodash';

namespace ChatFromList {
  export interface Props {
    dialog: Dialog;
  }
}

const ChatFromList = ({ dialog }: ChatFromList.Props) => {
  const { interlocutor, lastMessage, conference } = dialog;
  const selectedDialog = useSelector(getSelectedDialogSelector) as Dialog;
  const currentUserId: number = useSelector<AppState, number>((state) => state.auth.authentication.userId);
  const isMessageCreatorCurrentUser: boolean = lastMessage?.userCreator?.id === currentUserId;
  const changeSelectedDialog = useActionWithDispatch(changeSelectedDialogAction);
  const isDialogSelected = selectedDialog?.id == dialog.id;
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
      return _.truncate(
        MessageUtils.constructSystemMessageText(lastMessage as Message, lastMessage?.userCreator?.id === currentUserId),
        {
          length: 19,
          omission: '...'
        }
      );
    }

    if (conference) {
      if (isMessageCreatorCurrentUser) {
        return _.truncate(`You: ${lastMessage.text}`, {
          length: 19,
          omission: '...'
        });
      }
      return _.truncate(`${lastMessage.userCreator?.firstName}: ${lastMessage.text}`, {
        length: 19,
        omission: '...'
      });
    }

    const shortedText = _.truncate(lastMessage.text, {
      length: 19,
      omission: '...'
    });

    return shortedText;
  };

  const setSelectedDialog = (): void => {
    changeSelectedDialog(dialog.id);
    history.push(`/chats/${dialog.id}`);
  };

  return (
    <div
      onClick={setSelectedDialog}
      className={isDialogSelected ? 'messenger__chat-block messenger__chat-block--active' : 'messenger__chat-block'}
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
        {(dialog.ownUnreadMessagesCount || false) && (
          <div className={dialog.isMuted ? 'messenger__count messenger__count--muted' : 'messenger__count'}>
            {dialog.ownUnreadMessagesCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatFromList;
