import { useOnClickOutside } from '@hooks/use-on-click-outside';
import { BaseEmoji, Picker } from 'emoji-mart';
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface IDeferredMessageSmilesProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
  closeSmilesDisplayedStatus: () => void;
  emojiRef: React.RefObject<HTMLDivElement>;
}

const DeferredMessageSmiles: React.FC<IDeferredMessageSmilesProps> = ({
  closeSmilesDisplayedStatus,
  setText,
  emojiRef,
}) => {
  const { t } = useTranslation();

  const addNewSmile = useCallback(
    (emoji: BaseEmoji) => {
      setText((oldText) => oldText + (emoji.native as string));
    },
    [setText],
  );

  return (
    <div ref={emojiRef} className="emoji-wrapper">
      <Picker
        set="apple"
        showSkinTones={false}
        showPreview={false}
        i18n={{
          search: t('emojiMart.search'),
          notfound: t('emojiMart.notfound'),
          categories: {
            search: t('emojiMart.categories.search'),
            recent: t('emojiMart.categories.recent'),
            people: t('emojiMart.categories.people'),
            nature: t('emojiMart.categories.nature'),
            foods: t('emojiMart.categories.foods'),
            activity: t('emojiMart.categories.activity'),
            places: t('emojiMart.categories.places'),
            objects: t('emojiMart.categories.objects'),
            symbols: t('emojiMart.categories.symbols'),
            flags: t('emojiMart.categories.flags'),
          },
        }}
        onSelect={addNewSmile}
      />
    </div>
  );
};

export default DeferredMessageSmiles;
