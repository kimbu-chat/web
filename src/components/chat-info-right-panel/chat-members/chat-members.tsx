import React, { useRef, useState, useCallback, RefObject, useEffect } from 'react';

import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { InfiniteScroll } from '@components/infinite-scroll';
import { SearchBox } from '@components/search-box';
// import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useInfinityDeferred } from '@hooks/use-infinity-deferred';
import { ReactComponent as OpenArrowSvg } from '@icons/open-arrow.svg';
import { getGroupChatUsersAction } from '@store/chats/actions';
import { IGetGroupChatUsersActionPayload } from '@store/chats/features/get-group-chat-users/get-group-chat-users';
import {
  // getMembersListForSelectedGroupChatSelector,
  getSelectedGroupChatCreatorIdSelector,
  getSelectedGroupCountMembers,
} from '@store/chats/selectors';
import { CHAT_MEMBERS_LIMIT } from '@utils/pagination-limits';

import { Member } from './chat-member/chat-member';

import './chat-members.scss';

const BLOCK_NAME = 'chat-members';

interface IChatMembersProps {
  rootRef: RefObject<HTMLDivElement>;
}

export const ChatMembers: React.FC<IChatMembersProps> = ({ rootRef }) => {
  const { t } = useTranslation();
  const [searchStr, setSearchStr] = useState<string>('');
  const [membersDisplayed, setMembersDisplayed] = useState(false);

  const userCreatorId = useSelector(getSelectedGroupChatCreatorIdSelector);
  const membersCount = useSelector(getSelectedGroupCountMembers);

  const prevMembersCount = useRef(membersCount);

  const {
    executeRequest: getGroupChatMembers,
    data: memberIds,
    loading,
    hasMore,
  } = useInfinityDeferred<IGetGroupChatUsersActionPayload, number>({
    action: getGroupChatUsersAction,
    limit: CHAT_MEMBERS_LIMIT,
  });

  useEffect(() => {
    const updateMembers = async () => {
      await getGroupChatMembers({
        name: searchStr,
        offset: memberIds.length,
        initializedByScroll: false,
      }, false);
    };

    if (membersDisplayed && prevMembersCount.current !== membersCount) {
      updateMembers();
      prevMembersCount.current = membersCount;
    }
  }, [
    membersDisplayed,
    getGroupChatMembers,
    membersCount,
    searchStr,
    memberIds.length,
  ]);

  const loadMore = useCallback(async () => {
    
    await getGroupChatMembers({
      name: searchStr,
      offset: memberIds.length,
      initializedByScroll: true,
    }, true);
  }, [getGroupChatMembers, searchStr, memberIds.length]);

  const search = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchStr(e.target.value);
      await getGroupChatMembers({
        name: e.target.value,
        offset: memberIds.length,
        initializedByScroll: false,
      }, false);
    },
    [getGroupChatMembers, memberIds.length],
  );

  const changeMembersDisplayedState = useCallback(
    () => setMembersDisplayed((oldState) => !oldState),
    [setMembersDisplayed],
  );

  return (
    <div className={BLOCK_NAME}>
      <button
        onClick={changeMembersDisplayedState}
        type="button"
        className={`${BLOCK_NAME}__heading-block`}>
        <h3 className={`${BLOCK_NAME}__heading`}>{t('chatMembers.title')}</h3>
        <div
          className={classnames(`${BLOCK_NAME}__open-arrow`, {
            [`${BLOCK_NAME}__open-arrow--rotated`]: membersDisplayed,
          })}>
          <OpenArrowSvg />
        </div>
      </button>

      {membersDisplayed && (
        <>
          <div className={`${BLOCK_NAME}__search`}>
            <SearchBox containerClassName={`${BLOCK_NAME}__search-container`} onChange={search} />
          </div>
          <InfiniteScroll
            debounceTime={500}
            triggerMargin={200}
            containerRef={rootRef}
            className={`${BLOCK_NAME}__members-list`}
            onReachBottom={loadMore}
            hasMore={hasMore}
            isLoading={loading}
            threshold={0.3}>
            {memberIds.map((memberId: number) => (
              <Member key={memberId} memberId={memberId} ownerId={userCreatorId} />
            ))}
          </InfiniteScroll>
        </>
      )}
    </div>
  );
};
