import React, { useCallback, useContext, useRef, useState } from 'react';
import { Picker, BaseEmoji } from 'emoji-mart';
import { ReactComponent as SmilesSvg } from '@icons/smiles.svg';
import 'emoji-mart/css/emoji-mart.css';
import { LocalizationContext } from '@contexts';
import { useOnClickOutside } from '@hooks/use-on-click-outside';
import './message-smiles.scss';

interface IMessageSmilesProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const MessageSmiles: React.FC<IMessageSmilesProps> = React.memo(({ setText }) => {
  const { t } = useContext(LocalizationContext);

  const [smilesRendered, setSmilesRendered] = useState(false);

  const changeSmilesDisplayedStatus = useCallback(() => {
    setSmilesRendered((oldState) => !oldState);
  }, [setSmilesRendered]);
  const closeSmilesDisplayedStatus = useCallback(() => {
    setSmilesRendered(() => false);
  }, [setSmilesRendered]);

  const emojiRef = useRef<HTMLDivElement>(null);
  const openEmojiRef = useRef<HTMLButtonElement>(null);

  useOnClickOutside(emojiRef, closeSmilesDisplayedStatus, openEmojiRef);

  const addNewSmile = useCallback(
    (emoji: BaseEmoji) => {
      setText((oldText) => oldText + (emoji.native as string));
    },
    [setText],
  );

  return (
    <>
      <button
        type="button"
        ref={openEmojiRef}
        onClick={changeSmilesDisplayedStatus}
        className="message-input__smiles-btn">
        <SmilesSvg />
      </button>
      {smilesRendered && (
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
      )}
    </>
  );
});

export default MessageSmiles;
