import React, { useCallback, useState } from 'react';

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

  const handleEmojiClick = useCallback(
    (e: React.SyntheticEvent<HTMLDivElement>) => {
      onEmojiClick(parsedEmojiData.emojis[(e.target as HTMLDivElement).dataset.emoji as string]);
    },
    [onEmojiClick],
  );

  const handleCategoryClick = useCallback(
    (e: React.SyntheticEvent<HTMLDivElement>) => {
      setSelectedCategory(
        parsedEmojiData.categories[Number((e.target as HTMLDivElement).dataset.categoryIndex)],
      );
    },
    [setSelectedCategory],
  );

  return (
    <div className={BLOCK_NAME}>
      <div className={`${BLOCK_NAME}__categories`}>
        {parsedEmojiData.categories.map((category, index) => (
          <div
            onClick={handleCategoryClick}
            data-category-index={index}
            key={parsedEmojiData.emojis[category.emojis[0]].id}
            className={classNames(`${BLOCK_NAME}__category`, {
              [`${BLOCK_NAME}__category--active`]: selectedCategory.id === category.id,
            })}>
            <Emoji emoji={parsedEmojiData.emojis[category.emojis[0]]} />
          </div>
        ))}
      </div>
      <div className={`${BLOCK_NAME}__category-smiles`}>
        {selectedCategory.emojis.map((emoji) => (
          <div
            data-emoji={emoji}
            onClick={handleEmojiClick}
            key={parsedEmojiData.emojis[emoji].id}
            className={`${BLOCK_NAME}__emoji-wrapper`}>
            <Emoji emoji={parsedEmojiData.emojis[emoji]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
