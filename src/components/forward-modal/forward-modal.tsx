import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { InfiniteScroll } from '@components/infinite-scroll';
import { IModalChildrenProps, Modal } from '@components/modal';
import { SearchBox } from '@components/search-box';
import { SelectEntity } from '@components/select-entity';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { ReactComponent as ForwardSvg } from '@icons/forward.svg';
import { Button } from '@shared-components/button';
import {
  getChatsAction,
  forwardMessagesAction,
  resetSearchChatsAction,
} from '@store/chats/actions';
import { getChatsListSelector, getSearchChatsListSelector } from '@store/chats/selectors';

import './forward-modal.scss';

const BLOCK_NAME = 'forward-modal';

interface IForwardModalProps {
  onClose: () => void;
  messageIdsToForward: number[];
}

export const InitialForwardModal: React.FC<IForwardModalProps & IModalChildrenProps> = ({
  animatedClose,
  messageIdsToForward,
}) => {
  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement>(null);

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
    });
  }, [loadChats, searchString]);

  const handleChatSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setSearchString(e.target.value);
      loadChats({
        name: e.target.value,
        initializedByScroll: false,
        showOnlyHidden: false,
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
      animatedClose();
    });
  }, [forwardMessages, messageIdsToForward, selectedChatIds, animatedClose]);

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
    <div ref={containerRef}>
      <Modal.Header>
        <>
          <ForwardSvg className={`${BLOCK_NAME}__icon`} />
          <span> {t('forwardModal.forward', { count: messageIdsToForward.length })} </span>
        </>
      </Modal.Header>
      <div className={BLOCK_NAME}>
        <SearchBox
          containerClassName={`${BLOCK_NAME}__search-container`}
          iconClassName={`${BLOCK_NAME}__search__icon`}
          inputClassName={`${BLOCK_NAME}__search__input`}
          onChange={handleChatSearchChange}
        />
        <InfiniteScroll
          containerRef={containerRef}
          className={`${BLOCK_NAME}__chats-block`}
          onReachBottom={loadMore}
          hasMore={searchString.length ? searchChatsList.hasMore : chatsList.hasMore}
          isLoading={searchString.length ? searchChatsList.loading : chatsList.loading}>
          {selectEntities}
        </InfiniteScroll>
        <div className={`${BLOCK_NAME}__btn-block`}>
          <button type="button" onClick={animatedClose} className={`${BLOCK_NAME}__cancel-btn`}>
            {t('forwardModal.cancel')}
          </button>
          <Button
            type="button"
            loading={loading}
            disabled={selectedChatIds.length === 0}
            onClick={forwardSelectedMessages}
            className={`${BLOCK_NAME}__confirm-btn`}>
            {t('forwardModal.send')}
          </Button>
        </div>
      </div>
    </div>
  );
};

const ForwardModal: React.FC<IForwardModalProps> = ({ onClose, ...props }) => (
  <Modal closeModal={onClose}>
    {(animatedClose: () => void) => (
      <InitialForwardModal {...props} onClose={onClose} animatedClose={animatedClose} />
    )}
  </Modal>
);

ForwardModal.displayName = 'ForwardModal';

export { ForwardModal };
