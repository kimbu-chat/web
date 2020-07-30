import React, { useContext } from 'react';
import './ChatFromList.scss';
import { Dialog } from 'app/store/dialogs/models';
import * as moment from 'moment';
import { useSelector } from 'react-redux';
import { MessageUtils } from 'app/utils/message-utils';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { useHistory } from 'react-router-dom';
import { getDialogInterlocutor, getInterlocutorInitials } from '../../../utils/get-interlocutor';
import { Avatar } from '@material-ui/core';
import StatusBadge from 'app/utils/StatusBadge';
import _ from 'lodash';
import { RootState } from 'app/store/root-reducer';
import { getSelectedDialogSelector } from 'app/store/dialogs/selectors';
import { ChatActions } from 'app/store/dialogs/actions';
import { SystemMessageType, Message } from 'app/store/messages/models';
import { LocalizationContext } from 'app/app';

namespace ChatFromList {
  export interface Props {
    dialog: Dialog;
    sideEffect: () => void;
  }
}

const ChatFromList = ({ dialog, sideEffect }: ChatFromList.Props) => {
  const { interlocutor, lastMessage, conference } = dialog;
  const { t } = useContext(LocalizationContext);
  const selectedDialog = useSelector(getSelectedDialogSelector) as Dialog;
  const currentUserId: number = useSelector<RootState, number>((state) => state.myProfile.user.id);
  const isMessageCreatorCurrentUser: boolean = lastMessage?.userCreator?.id === currentUserId;
  const changeSelectedDialog = useActionWithDispatch(ChatActions.changeSelectedChat);
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
        return _.truncate(`${t('chatFromList.you')}: ${lastMessage.text}`, {
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
    sideEffect();
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
        <StatusBadge user={dialog.interlocutor!} />
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
