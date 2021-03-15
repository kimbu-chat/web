import { Modal, WithBackground } from 'components';
import React, { useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';
import { ChatActions } from 'store/chats/actions';
import { getChatsSelector, getHasMoreChatsSelector, getChatsLoadingSelector, getSearchChatsSelector, getSearchStringSelector } from 'app/store/chats/selectors';
import { InfiniteScroll } from 'app/components/messenger-page/shared/infinite-scroll/infinite-scroll';
import { SearchBox } from 'app/components';
import './forward-modal.scss';
import { ForwardMessages } from 'app/store/chats/features/forward-messages/forward-messages';
import { IChat } from 'app/store/chats/models';
import ForwardSvg from 'icons/reply.svg';
import { ForwardEntity } from './forward-entity/forward-entity';

interface IForwardModalProps {
  onClose: () => void;
  messageIdsToForward: number[];
}

export const ForwardModal: React.FC<IForwardModalProps> = React.memo(({ onClose, messageIdsToForward }) => {
  const { t } = useContext(LocalizationContext);

  const chats = useSelector(getChatsSelector);
  const chatsAreLoading = useSelector(getChatsLoadingSelector);
  const hasMoreChats = useSelector(getHasMoreChatsSelector);
  const searchString = useSelector(getSearchStringSelector);
  const searchChats = useSelector(getSearchChatsSelector);

  const [selectedChatIds, setSelectedChatIds] = useState<number[]>([]);

  const loadChats = useActionWithDispatch(ChatActions.getChats);
  const forwardMessages = useActionWithDispatch(ForwardMessages.action);

  const isSelected = useCallback((id: number) => selectedChatIds.includes(id), [selectedChatIds]);

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

  const loadMore = useCallback(() => {
    loadChats({
      name: searchString,
      showOnlyHidden: false,
      initializedByScroll: true,
      showAll: true,
    });
  }, [loadChats, searchString]);

  const handleChatSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      loadChats({
        name: e.target.value,
        initializedByScroll: false,
        showOnlyHidden: false,
        showAll: true,
      });
    },
    [loadChats],
  );

  const forwardSelectedMessages = useCallback(() => {
    forwardMessages({
      messageIdsToForward,
      chatIdsToForward: selectedChatIds,
    });

    onClose();
  }, [selectedChatIds, messageIdsToForward]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={
          <>
            <ForwardSvg viewBox='0 0 16 16' className='forward-modal__icon' />
            <span> {t('forwardModal.forward', { count: messageIdsToForward.length })} </span>
          </>
        }
        closeModal={onClose}
        content={
          <div className='forward-modal'>
            <SearchBox
              containerClassName='forward-modal__search-container'
              iconClassName='forward-modal__search__icon'
              inputClassName='forward-modal__search__input'
              onChange={handleChatSearchChange}
            />
            <InfiniteScroll className='forward-modal__chats-block' onReachExtreme={loadMore} hasMore={hasMoreChats} isLoading={chatsAreLoading}>
              {searchString.length > 0
                ? searchChats?.map((chat: IChat) => (
                    <ForwardEntity key={chat.id} chat={chat} isSelected={isSelected(chat.id)} changeSelectedState={changeSelectedState} />
                  ))
                : chats?.map((chat: IChat) => (
                    <ForwardEntity key={chat.id} chat={chat} isSelected={isSelected(chat.id)} changeSelectedState={changeSelectedState} />
                  ))}
            </InfiniteScroll>
          </div>
        }
        buttons={[
          <button type='button' onClick={onClose} className='forward-modal__cancel-btn'>
            {t('forwardModal.cancel')}
          </button>,
          <button type='button' onClick={forwardSelectedMessages} className='forward-modal__confirm-btn'>
            {t('forwardModal.send')}
          </button>,
        ]}
      />
    </WithBackground>
  );
});
