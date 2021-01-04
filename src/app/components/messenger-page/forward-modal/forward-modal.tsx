import { Modal, WithBackground } from 'components';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import './forward-modal.scss';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';
import { ChatActions } from 'store/chats/actions';
import { getChatsSelector, getHasMoreChatsSelector, getChatsLoadingSelector } from 'app/store/chats/selectors';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { CHATS_LIMIT } from 'app/utils/pagination-limits';
import { SearchBox } from 'app/components';
import { ForwardEntity } from './forward-entity/forward-entity';

interface IForwardModalProps {
  onClose: () => void;
  messageIdsToForward: number[];
}

export const ForwardModal: React.FC<IForwardModalProps> = React.memo(({ onClose }) => {
  const { t } = useContext(LocalizationContext);
  const chats = useSelector(getChatsSelector);
  const chatsAreLoading = useSelector(getChatsLoadingSelector);
  const hasMoreChats = useSelector(getHasMoreChatsSelector);

  const [selectedChatIds, setSelectedChatIds] = useState<number[]>([]);
  const [searchString, setSearchString] = useState('');

  const loadChats = useActionWithDispatch(ChatActions.getChats);

  const isSelected = useCallback((id: number) => selectedChatIds.includes(id), [selectedChatIds]);

  useEffect(() => {
    loadChats({
      page: { offset: 0, limit: CHATS_LIMIT },
      name: searchString,
      initializedBySearch: true,
      showOnlyHidden: false,
      showAll: true,
    });
  }, [searchString]);

  const changeSelectedState = useCallback(
    (id: number) => {
      if (selectedChatIds.includes(id)) {
        setSelectedChatIds((oldChatIds) => oldChatIds.filter((idToCheck) => idToCheck !== id));
      } else {
        setSelectedChatIds((oldChatIds) => [...oldChatIds, id]);
      }
    },
    [selectedChatIds],
  );

  const searchChats = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    [setSearchString],
  );

  const loadMore = useCallback(() => {
    loadChats({
      page: { offset: chats.length, limit: CHATS_LIMIT },
      name: searchString,
      showOnlyHidden: false,
      initializedBySearch: false,
      showAll: true,
    });
  }, [loadChats, searchString, chats]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={t('forwardModal.forward')}
        closeModal={onClose}
        contents={
          <div className='forward-modal'>
            <SearchBox onChange={searchChats} />
            <InfiniteScroll className='forward-modal__chats-block' onReachExtreme={loadMore} hasMore={hasMoreChats} isLoading={chatsAreLoading}>
              {chats.map((chat) => (
                <ForwardEntity key={chat.id} chat={chat} isSelected={isSelected(chat.id)} changeSelectedState={changeSelectedState} />
              ))}
            </InfiniteScroll>
          </div>
        }
        buttons={[
          {
            children: t('forwardModal.send'),
            className: 'forward-modal__confirm-btn',
            onClick: () => {},
            position: 'left',
            width: 'contained',
            variant: 'contained',
            color: 'primary',
          },
        ]}
      />
    </WithBackground>
  );
});
