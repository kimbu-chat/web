import type { BaseEmoji, Data } from 'emoji-mart';
import NimblePicker from 'emoji-mart/dist-es/components/picker/nimble-picker';
import data from 'emoji-mart/data/apple.json';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface IDeferredMessageSmilesProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
  emojiRef: React.RefObject<HTMLDivElement>;
}

const DeferredMessageSmiles: React.FC<IDeferredMessageSmilesProps> = ({ setText, emojiRef }) => {
  const { t } = useTranslation();

  const addNewSmile = useCallback(
    (emoji: BaseEmoji) => {
      setText((oldText) => oldText + (emoji.native as string));
    },
    [setText],
  );

  const emojis: unknown = data as unknown;

  return (
    <div ref={emojiRef} className="emoji-wrapper">
      <NimblePicker
        data={emojis as Data}
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
