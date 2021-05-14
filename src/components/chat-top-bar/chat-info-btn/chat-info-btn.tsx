import React from 'react';
import { useSelector } from 'react-redux';

import { ReactComponent as ChatInfoSvg } from '@icons/chat-info.svg';
import { getIsInfoOpenedSelector } from '@store/chats/selectors';

interface IChatItemProps {
  toggleVisibility: () => void;
}

const ChatInfoBtn: React.FC<IChatItemProps> = ({ toggleVisibility }) => {
  const isInfoOpened = useSelector(getIsInfoOpenedSelector);

  return (
    <button
      type="button"
      onClick={toggleVisibility}
      className={`chat-data__button ${isInfoOpened ? 'chat-data__button--active' : ''}`}>
      <ChatInfoSvg />
    </button>
  );
};

ChatInfoBtn.displayName = 'ChatInfoBtn';

export { ChatInfoBtn };
