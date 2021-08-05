import React, { useState, useCallback, useRef } from 'react';

import classnames from 'classnames';
import { IPaginationParams } from 'kimbu-models';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { InfiniteScroll } from '@components/infinite-scroll';
import { SearchBox } from '@components/search-box';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as OpenArrowSvg } from '@icons/open-arrow.svg';
import { getGroupChatUsersAction } from '@store/chats/actions';
import {
  getMembersListForSelectedGroupChatSelector,
  getSelectedGroupChatCreatorIdSelector,
} from '@store/chats/selectors';
import { CHAT_MEMBERS_LIMIT } from '@utils/pagination-limits';

import { Member } from './chat-member/chat-member';

import './chat-members.scss';

const BLOCK_NAME = 'chat-members';

export const ChatMembers: React.FC = () => {
  const [searchStr, setSearchStr] = useState<string>('');
  const [membersDisplayed, setMembersDisplayed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const getGroupChatUsers = useActionWithDispatch(getGroupChatUsersAction);

  const membersListForGroupChat = useSelector(getMembersListForSelectedGroupChatSelector);
  const userCreatorId = useSelector(getSelectedGroupChatCreatorIdSelector);

  const loadMore = useCallback(() => {
    const page: IPaginationParams = {
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
    <div className={BLOCK_NAME} ref={containerRef}>
      <div className={`${BLOCK_NAME}__heading-block`}>
        <h3 className={`${BLOCK_NAME}__heading`}>{t('chatMembers.title')}</h3>
        <button
          type="button"
          onClick={changeMembersDisplayedState}
          className={classnames(`${BLOCK_NAME}__open-arrow`, {
            [`${BLOCK_NAME}__open-arrow--rotated`]: membersDisplayed,
          })}>
          <OpenArrowSvg />
        </button>
      </div>

      {membersDisplayed && (
        <>
          <div className={`${BLOCK_NAME}__search`}>
            <SearchBox containerClassName={`${BLOCK_NAME}__search-container`} onChange={search} />
          </div>

          <InfiniteScroll
            containerRef={containerRef}
            className={`${BLOCK_NAME}__members-list`}
            onReachBottom={loadMore}
            hasMore={membersListForGroupChat?.hasMore}
            isLoading={membersListForGroupChat?.loading}
            threshold={0.3}>
            {membersListForGroupChat?.memberIds?.map((memberId) => (
              <Member isOwner={userCreatorId === memberId} memberId={memberId} key={memberId} />
            ))}
          </InfiniteScroll>
        </>
      )}
    </div>
  );
};
