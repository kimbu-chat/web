import React, { useCallback } from 'react';

import { IEmoji } from '@utils/smiles';
import './emoji.scss';

interface IEmojiProps {
  emoji: IEmoji;
  onClick?: (emoji: IEmoji) => void;
}

const BLOCK_NAME = 'emoji';

export const Emoji: React.FC<IEmojiProps> = ({ emoji, onClick }) => {
  const onClickOnEmoji = useCallback(() => {
    if (onClick) {
      onClick(emoji);
    }
  }, [emoji, onClick]);

  return (
    <div onClick={onClickOnEmoji} className={BLOCK_NAME}>
      <img
        className={`${BLOCK_NAME}__icon`}
        src={`https://raw.githubusercontent.com/korenskoy/emoji-data-ios/master/img-apple-64/${emoji.image}.png`}
        alt={emoji.native}
        loading="lazy"
      />
    </div>
  );
};
