import React, { useCallback, useMemo, useState, useRef, memo } from 'react';

import classNames from 'classnames';
import { IUser } from 'kimbu-models';
import { property } from 'lodash';
import debounce from 'lodash/debounce';
import flow from 'lodash/flow';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { InfiniteScroll } from '@components/infinite-scroll';
import { Modal, IModalChildrenProps } from '@components/modal';
import { SearchBox } from '@components/search-box';
import { SelectEntity } from '@components/select-entity';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useInfinityDeferred } from '@hooks/use-infinity-deferred';
import { ReactComponent as GroupSvg } from '@icons/group.svg';
import { Button } from '@shared-components/button';
import { addUsersToGroupChatAction, getPossibleChatMembersAction } from '@store/chats/actions';
import { IPossibleChatMembersActionPayload } from '@store/chats/features/get-possible-members/action-payloads/get-possible-members-action-payload';
import { getInfoChatSelector } from '@store/chats/selectors';
import { CHAT_MEMBERS_LIMIT } from '@utils/pagination-limits';

import './group-chat-add-friend-modal.scss';

interface IGroupChatAddFriendModalProps {
  onClose: () => void;
}

const BLOCK_NAME = 'group-chat-add-friend-modal';

const DEBOUNCE_TO_SEARCH = 1000;

const InitialGroupChatAddFriendModal: React.FC<
  IGroupChatAddFriendModalProps & IModalChildrenProps
> = ({ animatedClose }) => {
  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [loadingAddUsers, setLoading] = useState(false);
  const [name, setName] = useState('');

  const chat = useSelector(
    // todo: avoid unnecessary renders
    getInfoChatSelector,
  );

  const addUsersToGroupChat = useActionWithDeferred(addUsersToGroupChatAction);
  const {
    executeRequest: getPossibleMembers,
    hasMore,
    data,
    loading,
  } = useInfinityDeferred<IPossibleChatMembersActionPayload, IUser>({
    action: getPossibleChatMembersAction,
    limit: CHAT_MEMBERS_LIMIT,
  });

  const isSelected = useCallback((id: number) => selectedUserIds.includes(id), [selectedUserIds]);

  const changeSelectedState = useCallback(
    (id: number) => {
      if (isSelected(id)) {
        setSelectedUserIds((oldChatIds) => oldChatIds.filter((idToCheck) => idToCheck !== id));
      } else {
        setSelectedUserIds((oldChatIds) => [...oldChatIds, id]);
      }
    },
    [setSelectedUserIds, isSelected],
  );

  const addUsers = useCallback((): void => {
    setLoading(true);

    if (selectedUserIds.length > 0) {
      addUsersToGroupChat({
        userIds: selectedUserIds,
      }).then(() => {
        setLoading(false);
        animatedClose();
      });
    }
  }, [addUsersToGroupChat, selectedUserIds, animatedClose]);

  const loadMore = useCallback(async () => {
    await getPossibleMembers({
      name,
      groupChatId: chat?.groupChat?.id as number,
      offset: data.length,
    });
  }, [getPossibleMembers, name, chat?.groupChat?.id, data.length]);

  const queryPossibleMembers = useCallback(
    async (searchName: string) => {
      setName(searchName);
      await getPossibleMembers({
        offset: data.length,
        name: searchName,
        groupChatId: chat?.groupChat?.id as number,
      });
    },
    [chat?.groupChat?.id, data.length, getPossibleMembers],
  );

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      flow([property('target.value'), debounce(queryPossibleMembers, DEBOUNCE_TO_SEARCH)])(e),
    [queryPossibleMembers],
  );

  const renderSelectEntity = useCallback(
    ({ id }) => (
      <SelectEntity
        key={id}
        userId={id}
        isSelected={isSelected(id)}
        changeSelectedState={changeSelectedState}
      />
    ),
    [changeSelectedState, isSelected],
  );

  const selectEntities = useMemo(() => data.map(renderSelectEntity), [data, renderSelectEntity]);

  return (
    <div ref={containerRef}>
      <Modal.Header>
        <>
          <GroupSvg className={`${BLOCK_NAME}__icon`} />
          <span>{t('groupChatAddFriendModal.add_members')}</span>
        </>
      </Modal.Header>
      <div className={`${BLOCK_NAME}__select-friends`}>
        <SearchBox
          containerClassName={`${BLOCK_NAME}__select-friends__search`}
          onChange={handleSearchInputChange}
        />
        <InfiniteScroll
          containerRef={containerRef}
          className={`${BLOCK_NAME}__friends-block`}
          onReachBottom={loadMore}
          hasMore={hasMore}
          isLoading={loading}>
          {selectEntities}
        </InfiniteScroll>

        <div className={`${BLOCK_NAME}__btn-block`}>
          <button
            type="button"
            className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--cancel`)}
            onClick={animatedClose}>
            {t('groupChatAddFriendModal.cancel')}
          </button>
          <Button
            disabled={selectedUserIds.length === 0}
            loading={loadingAddUsers}
            type="button"
            onClick={addUsers}
            className={classNames(`${BLOCK_NAME}__btn`, `${BLOCK_NAME}__btn--confirm`)}>
            {t('groupChatAddFriendModal.add_members')}
          </Button>
        </div>
      </div>
    </div>
  );
};

const GroupChatAddFriendModal: React.FC<IGroupChatAddFriendModalProps> = memo(({ onClose }) => (
  <Modal closeModal={onClose}>
    {(animatedClose: () => void) => (
      <InitialGroupChatAddFriendModal onClose={onClose} animatedClose={animatedClose} />
    )}
  </Modal>
));

GroupChatAddFriendModal.displayName = 'GroupChatAddFriendModal';

export { GroupChatAddFriendModal };
