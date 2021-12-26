import React, {useState, useCallback, RefObject} from 'react';

import classnames from 'classnames';
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

import { Member } from './chat-member/chat-member';

import './chat-members.scss';

const BLOCK_NAME = 'chat-members';

interface IChatMembersProps {
  rootRef: RefObject<HTMLDivElement>
}

export const ChatMembers: React.FC<IChatMembersProps> = ({ rootRef}) => {
  const [searchStr, setSearchStr] = useState<string>('');
  const [membersDisplayed, setMembersDisplayed] = useState(false);
  const { t } = useTranslation();

  const getGroupChatUsers = useActionWithDispatch(getGroupChatUsersAction);

  const membersListForGroupChat = useSelector(getMembersListForSelectedGroupChatSelector);
  const userCreatorId = useSelector(getSelectedGroupChatCreatorIdSelector);

  const loadMore = useCallback(() => {
    getGroupChatUsers({
      name: searchStr,
      isFromSearch: searchStr.length > 0,
    });
  }, [getGroupChatUsers, searchStr]);

  const search = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchStr(e.target.value);
      getGroupChatUsers({
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
            hasMore={membersListForGroupChat?.hasMore}
            isLoading={membersListForGroupChat?.loading}
            threshold={0.3}>
            {membersListForGroupChat?.memberIds?.map((memberId: number) => (
              <Member key={memberId} memberId={memberId} ownerId={userCreatorId} />
            ))}
          </InfiniteScroll>
        </>
      )}
    </div>
  );
};
