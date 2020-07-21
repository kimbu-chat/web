import React, { useEffect } from 'react';
import ChatFromList from '../ChatFromList/ChatFromList';

import './ChatList.scss';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import { getDialogsAction } from 'app/store/dialogs/actions';
import { useSelector } from 'react-redux';
import { AppState } from 'app/store';
import { Dialog } from 'app/store/dialogs/types';

namespace ChatList {
  export interface Props {
    hideChatInfo: () => void;
  }
}

export const DIALOGS_LIMIT = 20;

const ChatList = ({ hideChatInfo }: ChatList.Props) => {
  const getDialogs = useActionWithDispatch(getDialogsAction);

  const dialogs = useSelector<AppState, Dialog[]>((rootState) => rootState.dialogs.dialogs) || [];

  useEffect(() => {
    getDialogs({
      page: { offset: dialogs.length, limit: DIALOGS_LIMIT },
      initializedBySearch: false,
      initiatedByScrolling: false
    });
  }, []);

  return (
    <div className="messenger__chat-list">
      {dialogs?.map((dialog: Dialog) => {
        return <ChatFromList sideEffect={hideChatInfo} dialog={dialog} key={dialog.id} />;
      })}
    </div>
  );
};

export default ChatList;
