import React, { useState } from 'react';

import classNames from 'classnames';
import emojiData from 'emoji-data-ios/emoji-data.json';

import { IEmoji, uncompressEmoji } from '@utils/smiles';

import './emoji-picker.scss';

import { Emoji } from '../emoji/emoji';

const parsedEmojiData = uncompressEmoji(emojiData);

interface IEmojiPickerProps {
  onEmojiClick: (emoji: IEmoji) => void;
}

const BLOCK_NAME = 'emoji-picker';

const EmojiPicker: React.FC<IEmojiPickerProps> = ({ onEmojiClick }) => {
  const [selectedCategory, setSelectedCategory] = useState(parsedEmojiData.categories[0]);

  return (
    <div className={BLOCK_NAME}>
      <div className={`${BLOCK_NAME}__categories`}>
        {parsedEmojiData.categories.map((category) => (
          <div
            key={parsedEmojiData.emojis[category.emojis[0]].id}
            className={classNames(`${BLOCK_NAME}__category`, {
              [`${BLOCK_NAME}__category--active`]: selectedCategory.id === category.id,
            })}>
            <Emoji
              onClick={() => setSelectedCategory(category)}
              emoji={parsedEmojiData.emojis[category.emojis[0]]}
            />
          </div>
        ))}
      </div>
      <div className={`${BLOCK_NAME}__category-smiles`}>
        {selectedCategory.emojis.map((emoji) => (
          <div key={parsedEmojiData.emojis[emoji].id} className={`${BLOCK_NAME}__emoji-wrapper`}>
            <Emoji onClick={onEmojiClick} emoji={parsedEmojiData.emojis[emoji]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
