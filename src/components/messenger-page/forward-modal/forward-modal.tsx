import { InfiniteScroll, SearchBox } from '@components/messenger-page';
import { Button, Modal, WithBackground } from '@components/shared';
import React, { useCallback, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';

import { useTranslation } from 'react-i18next';
import { getChatsAction, forwardMessagesAction } from '@store/chats/actions';
import {
  getChatsSelector,
  getHasMoreChatsSelector,
  getChatsLoadingSelector,
  getSearchChatsSelector,
} from '@store/chats/selectors';

import './forward-modal.scss';
import { IChat } from '@store/chats/models';
import { ReactComponent as ForwardSvg } from '@icons/forward.svg';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { SelectEntity } from '../shared/select-entity/select-entity';

interface IForwardModalProps {
  onClose: () => void;
  messageIdsToForward: number[];
}

export const ForwardModal: React.FC<IForwardModalProps> = React.memo(
  ({ onClose, messageIdsToForward }) => {
    const { t } = useTranslation();

    const chats = useSelector(getChatsSelector);
    const chatsAreLoading = useSelector(getChatsLoadingSelector);
    const hasMoreChats = useSelector(getHasMoreChatsSelector);
    const searchChats = useSelector(getSearchChatsSelector);

    const [selectedChatIds, setSelectedChatIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchString, setSearchString] = useState('');

    const loadChats = useActionWithDispatch(getChatsAction);
    const forwardMessages = useActionWithDeferred(forwardMessagesAction);

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
      (chat: IChat) => (
        <SelectEntity
          key={chat.id}
          chatOrUser={chat}
          isSelected={isSelected(chat.id)}
          changeSelectedState={changeSelectedState}
        />
      ),
      [changeSelectedState, isSelected],
    );

    const selectEntities = useMemo(() => {
      if (searchString.length) {
        return searchChats.map(renderSelectEntity);
      }
      return chats.map(renderSelectEntity);
    }, [searchString.length, searchChats, chats, renderSelectEntity]);

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
                onReachExtreme={loadMore}
                hasMore={hasMoreChats}
                isLoading={chatsAreLoading}>
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
  },
);
