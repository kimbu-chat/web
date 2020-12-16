import React, { useState, useEffect, useCallback } from 'react';
import './chat-members.scss';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { Chat } from 'store/chats/models';
import { ChatActions } from 'store/chats/actions';
import { getMembersListForSelectedGroupChat, getSelectedChatSelector } from 'store/chats/selectors';
import AddSvg from 'icons/ic-add-new.svg';
import { InfiniteScroll } from 'app/utils/infinite-scroll/infinite-scroll';
import { Page } from 'app/store/common/models';
import { CHAT_MEMBERS_LIMIT } from 'app/utils/pagination-limits';
import { SearchBox } from '../../search-box/search-box';

import { Member } from './chat-member/chat-member';

namespace ChatMembersNS {
  export interface Props {
    addMembers: () => void;
  }
}

export const ChatMembers = React.memo(({ addMembers }: ChatMembersNS.Props) => {
  const [searchStr, setSearchStr] = useState<string>('');

  const getGroupChatUsers = useActionWithDispatch(ChatActions.getGroupChatUsers);
  const selectedChat = useSelector(getSelectedChatSelector) as Chat;

  const membersListForGroupChat = useSelector(getMembersListForSelectedGroupChat);

  useEffect(() => {
    getGroupChatUsers({
      groupChatId: selectedChat.groupChat?.id || -1,
      page: { offset: 0, limit: CHAT_MEMBERS_LIMIT },
    });
    return () => {
      setSearchStr('');
    };
  }, [selectedChat.id]);

  const loadMore = useCallback(() => {
    const page: Page = {
      offset:
        ((membersListForGroupChat?.searchMembers?.length || 0) > 0 ? membersListForGroupChat?.searchMembers : membersListForGroupChat?.members)?.length || 0,
      limit: CHAT_MEMBERS_LIMIT,
    };

    getGroupChatUsers({
      groupChatId: selectedChat.groupChat?.id || -1,
      page,
      name: searchStr,
      isFromScroll: true,
      isFromSearch: searchStr.length > 0,
    });
  }, [selectedChat, membersListForGroupChat]);

  return (
    <div className='chat-members'>
      <div className='chat-members__heading-block'>
        <h3 className='chat-members__heading'>Members</h3>
        <button type='button' onClick={() => addMembers()} className='chat-members__add'>
          <AddSvg viewBox='0 0 25 25' />
        </button>
      </div>

      <div className='chat-members__search'>
        <SearchBox
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchStr(e.target.value);
            getGroupChatUsers({
              groupChatId: selectedChat.groupChat?.id || -1,
              page: { offset: 0, limit: CHAT_MEMBERS_LIMIT },
              name: e.target.value,
            });
          }}
        />
      </div>

      <InfiniteScroll
        className='chat-members__members-list'
        onReachExtreme={loadMore}
        hasMore={membersListForGroupChat?.hasMore}
        isLoading={membersListForGroupChat?.loading}
        threshold={0.3}
      >
        {((membersListForGroupChat?.searchMembers?.length || 0) > 0 ? membersListForGroupChat?.searchMembers : membersListForGroupChat?.members)?.map(
          (member) => (
            <Member member={member} key={member?.id} />
          ),
        )}
      </InfiniteScroll>
    </div>
  );
});
