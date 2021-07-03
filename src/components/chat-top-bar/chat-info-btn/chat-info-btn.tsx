import React from 'react';

import classnames from 'classnames';
import { useSelector } from 'react-redux';

import { ReactComponent as ChatInfoSvg } from '@icons/chat-info.svg';
import { getIsInfoOpenedSelector } from '@store/chats/selectors';

interface IChatItemProps {
  toggleVisibility: () => void;
}

const BLOCK_NAME = 'chat-data';

const ChatInfoBtn: React.FC<IChatItemProps> = ({ toggleVisibility }) => {
  const isInfoOpened = useSelector(getIsInfoOpenedSelector);

  return (
    <button
      type="button"
      onClick={toggleVisibility}
      className={classnames(`${BLOCK_NAME}__button`, {
        [`${BLOCK_NAME}__button--active`]: isInfoOpened,
      })}>
      <ChatInfoSvg />
    </button>
  );
};

ChatInfoBtn.displayName = 'ChatInfoBtn';

export { ChatInfoBtn };
