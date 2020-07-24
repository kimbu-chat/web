import React, { useEffect, useRef } from 'react';
import ChatFromList from '../ChatFromList/ChatFromList';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from '@material-ui/core/CircularProgress';
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
  const hasMoreDialogs = useSelector<AppState, boolean>((rootState) => rootState.dialogs.hasMore);

  useEffect(() => {
    getDialogs({
      page: { offset: dialogs.length, limit: DIALOGS_LIMIT },
      initializedBySearch: false,
      initiatedByScrolling: false
    });
  }, []);

  const loadPage = (page: number) => {
    const pageData = {
      limit: 25,
      offset: page * 25
    };

    getDialogs({
      page: pageData,
      initializedBySearch: false,
      initiatedByScrolling: true
    });
  };

  const chatListRef = useRef(null);

  return (
    <div ref={chatListRef} className="messenger__chat-list">
      <InfiniteScroll
        pageStart={0}
        loadMore={loadPage}
        hasMore={hasMoreDialogs}
        loader={
          <div className="loader " key={0}>
            <div className="">
              <CircularProgress />
            </div>
          </div>
        }
        useWindow={false}
        getScrollParent={() => chatListRef.current}
        isReverse={false}
      >
        {dialogs?.map((dialog: Dialog) => {
          return <ChatFromList sideEffect={hideChatInfo} dialog={dialog} key={dialog.id} />;
        })}
      </InfiniteScroll>
    </div>
  );
};

export default ChatList;
