import React, { useCallback } from 'react';

import data from 'emoji-mart/data/apple.json';
import NimblePicker from 'emoji-mart/dist-es/components/picker/nimble-picker';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Theme } from '@store/settings/features/models';
import { getCurrentThemeSelector } from '@store/settings/selectors';

import type { BaseEmoji, Data } from 'emoji-mart';

interface IDeferredMessageSmilesProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
  emojiRef: React.RefObject<HTMLDivElement>;
}

const DeferredMessageSmiles: React.FC<IDeferredMessageSmilesProps> = ({ setText, emojiRef }) => {
  const { t } = useTranslation();

  const theme = useSelector(getCurrentThemeSelector);

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
        theme={theme === Theme.DARK ? 'dark' : 'light'}
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
