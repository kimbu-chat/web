import React, { useState, useCallback } from 'react';
import './chat-members.scss';
import { useSelector } from 'react-redux';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { getGroupChatUsersAction } from '@store/chats/actions';
import { getMembersListForSelectedGroupChatSelector } from '@store/chats/selectors';
import { ReactComponent as OpenArrowSvg } from '@icons/open-arrow.svg';
import { InfiniteScroll } from '@components/infinite-scroll';
import { SearchBox } from '@components/search-box/search-box';
import { IPage } from '@store/common/models';
import { CHAT_MEMBERS_LIMIT } from '@utils/pagination-limits';

import { Member } from './chat-member/chat-member';

export const ChatMembers: React.FC = () => {
  const [searchStr, setSearchStr] = useState<string>('');
  const [membersDisplayed, setMembersDisplayed] = useState(false);

  const getGroupChatUsers = useActionWithDispatch(getGroupChatUsersAction);

  const membersListForGroupChat = useSelector(getMembersListForSelectedGroupChatSelector);

  const loadMore = useCallback(() => {
    const page: IPage = {
      offset: membersListForGroupChat?.memberIds?.length || 0,
      limit: CHAT_MEMBERS_LIMIT,
    };

    getGroupChatUsers({
      page,
      name: searchStr,
      isFromSearch: searchStr.length > 0,
    });
  }, [getGroupChatUsers, membersListForGroupChat?.memberIds?.length, searchStr]);

  const search = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchStr(e.target.value);
      getGroupChatUsers({
        page: { offset: 0, limit: CHAT_MEMBERS_LIMIT },
        name: e.target.value,
        isFromSearch: true,
      });
    },
    [getGroupChatUsers],
  );

  const changeMembersDisplayedState = useCallback(
    () => setMembersDisplayed((oldState) => !oldState),
    [setMembersDisplayed],
  );

  return (
    <div className="chat-members">
      <div className="chat-members__heading-block">
        <h3 className="chat-members__heading">Members</h3>
        <button
          type="button"
          onClick={changeMembersDisplayedState}
          className={`chat-members__open-arrow ${
            membersDisplayed ? 'chat-members__open-arrow--rotated' : ''
          }`}>
          <OpenArrowSvg />
        </button>
      </div>

      {membersDisplayed && (
        <>
          <div className="chat-members__search">
            <SearchBox containerClassName="chat-members__search-container" onChange={search} />
          </div>

          <InfiniteScroll
            className="chat-members__members-list"
            onReachExtreme={loadMore}
            hasMore={membersListForGroupChat?.hasMore}
            isLoading={membersListForGroupChat?.loading}
            threshold={0.3}>
            {membersListForGroupChat?.memberIds?.map((memberId) => (
              <Member memberId={memberId} key={memberId} />
            ))}
          </InfiniteScroll>
        </>
      )}
    </div>
  );
};
