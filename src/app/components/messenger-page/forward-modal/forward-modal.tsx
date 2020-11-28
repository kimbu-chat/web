import { Modal, WithBackground } from 'components';
import { RootState } from 'store/root-reducer';
import React, { useCallback, useContext, useState } from 'react';

import { useSelector } from 'react-redux';
import './forward-modal.scss';
import { useActionWithDispatch } from 'utils/hooks/use-action-with-dispatch';
import { LocalizationContext } from 'app/app';
import { ChatActions } from 'store/chats/actions';
import { Chat } from 'store/chats/models';
import { SearchBox } from '../search-box/search-box';
import { ForwardEntity } from './forward-entity/forward-entity';

namespace ForwardModalNS {
  export interface Props {
    onClose: () => void;
    messageIdsToForward: number[];
  }
}

export const ForwardModal = React.memo(({ onClose }: ForwardModalNS.Props) => {
  const { t } = useContext(LocalizationContext);
  const chats = useSelector<RootState, Chat[]>((rootState) => rootState.chats.chats);
  const [selectedChatIds, setSelectedChatIds] = useState<number[]>([]);

  const loadChats = useActionWithDispatch(ChatActions.getChats);

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

  const searchChats = useCallback((name: string) => {
    loadChats({
      page: { offset: 0, limit: 25 },
      name,
      initializedBySearch: true,
      showOnlyHidden: false,
      showAll: true,
    });
  }, []);

  return (
    <WithBackground onBackgroundClick={onClose}>
      <Modal
        title={t('forwardModal.forward')}
        closeModal={onClose}
        contents={
          <div className='forward-modal'>
            <SearchBox onChange={(e) => searchChats(e.target.value)} />
            <div className='forward-modal__chats-block'>
              {chats.map((chat) => (
                <ForwardEntity key={chat.id} chat={chat} isSelected={isSelected(chat.id)} changeSelectedState={changeSelectedState} />
              ))}
            </div>
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
