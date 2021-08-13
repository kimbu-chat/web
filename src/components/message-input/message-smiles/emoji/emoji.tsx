import React from 'react';

import { IEmoji } from '@utils/smiles';
import './emoji.scss';

interface IEmojiProps {
  emoji: IEmoji;
}

const BLOCK_NAME = 'emoji';

export const Emoji: React.FC<IEmojiProps> = ({ emoji }) => (
  <div className={BLOCK_NAME}>
    <img
      className={`${BLOCK_NAME}__icon`}
      data-emoji={emoji.id}
      src={`https://raw.githubusercontent.com/korenskoy/emoji-data-ios/master/img-apple-64/${emoji.image}.png`}
      alt={emoji.native}
      loading="lazy"
    />
  </div>
);
