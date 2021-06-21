import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { WithBackground } from '@components/with-background';
import { Modal } from '@components/modal';
import { Button } from '@components/button';
import { InfiniteScroll } from '@components/infinite-scroll';
import { SearchBox } from '@components/search-box';
import {
  getChatsAction,
  forwardMessagesAction,
  resetSearchChatsAction,
} from '@store/chats/actions';
import { getChatsListSelector, getSearchChatsListSelector } from '@store/chats/selectors';
import { ReactComponent as ForwardSvg } from '@icons/forward.svg';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';

import { SelectEntity } from '../select-entity/select-entity';

import './forward-modal.scss';

interface IForwardModalProps {
  onClose: () => void;
  messageIdsToForward: number[];
}

const ForwardModal: React.FC<IForwardModalProps> = ({ onClose, messageIdsToForward }) => {
  const { t } = useTranslation();

  const chatsList = useSelector(getChatsListSelector);
  const searchChatsList = useSelector(getSearchChatsListSelector);

  const [selectedChatIds, setSelectedChatIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState('');

  const loadChats = useActionWithDispatch(getChatsAction);
  const forwardMessages = useActionWithDeferred(forwardMessagesAction);
  const resetSearchChats = useActionWithDispatch(resetSearchChatsAction);

  useEffect(
    () => () => {
      resetSearchChats();
    },
    [resetSearchChats],
  );

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
      setSearchString(e.target.value);
      loadChats({
        name: e.target.value,
        initializedByScroll: false,
        showOnlyHidden: false,
        showAll: true,
      });
    },
    [loadChats, setSearchString],
  );

  const forwardSelectedMessages = useCallback(() => {
    setLoading(true);
    forwardMessages({
      messageIdsToForward,
      chatIdsToForward: selectedChatIds,
    }).then(() => {
      setLoading(false);
      onClose();
    });
  }, [forwardMessages, messageIdsToForward, selectedChatIds, onClose]);

  const renderSelectEntity = useCallback(
    (chatId: number) => (
      <SelectEntity
        key={chatId}
        chatId={chatId}
        isSelected={isSelected(chatId)}
        changeSelectedState={changeSelectedState}
      />
    ),
    [changeSelectedState, isSelected],
  );

  const selectEntities = useMemo(() => {
    if (searchString.length) {
      return searchChatsList.chatIds.map(renderSelectEntity);
    }
    return chatsList.chatIds.map(renderSelectEntity);
  }, [searchString.length, searchChatsList, chatsList, renderSelectEntity]);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={
          <>
            <ForwardSvg viewBox="0 0 16 16" className="forward-modal__icon" />
            <span> {t('forwardModal.forward', { count: messageIdsToForward.length })} </span>
          </>
        }
        closeModal={onClose}
        content={
          <div className="forward-modal">
            <SearchBox
              containerClassName="forward-modal__search-container"
              iconClassName="forward-modal__search__icon"
              inputClassName="forward-modal__search__input"
              onChange={handleChatSearchChange}
            />
            <InfiniteScroll
              className="forward-modal__chats-block"
              onReachBottom={loadMore}
              hasMore={searchString.length ? searchChatsList.hasMore : chatsList.hasMore}
              isLoading={searchString.length ? searchChatsList.loading : chatsList.loading}>
              {selectEntities}
            </InfiniteScroll>
          </div>
        }
        buttons={[
          <button key={1} type="button" onClick={onClose} className="forward-modal__cancel-btn">
            {t('forwardModal.cancel')}
          </button>,
          <Button
            key={2}
            type="button"
            loading={loading}
            disabled={selectedChatIds.length === 0}
            onClick={forwardSelectedMessages}
            className="forward-modal__confirm-btn">
            {t('forwardModal.send')}
          </Button>,
        ]}
      />
    </WithBackground>
  );
};

ForwardModal.displayName = 'ForwardModal';

export { ForwardModal };
