import React, { useCallback, useRef, useState, lazy, Suspense } from 'react';

import 'emoji-mart/css/emoji-mart.css';

import './message-smiles.scss';
import { CubeLoader } from '@components/cube-loader';
import { ReactComponent as SmilesSvg } from '@icons/smiles.svg';
import { loadEmojiPicker } from '@routing/module-loader';
import { IEmoji } from '@utils/smiles';

const EmojiPicker = lazy(loadEmojiPicker);

interface IMessageSmilesProps {
  onSelectEmoji: (emoji: string) => void;
}

export const MessageSmiles: React.FC<IMessageSmilesProps> = React.memo(({ onSelectEmoji }) => {
  const [smilesRendered, setSmilesRendered] = useState(false);

  const displaySmiles = useCallback(() => {
    setSmilesRendered(true);
  }, [setSmilesRendered]);

  const openEmojiRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        type="button"
        ref={openEmojiRef}
        onMouseOver={displaySmiles}
        className="message-input__smiles-btn">
        <SmilesSvg />
      </button>
      {smilesRendered && (
        <Suspense fallback={<CubeLoader />}>
          <EmojiPicker onEmojiClick={(emoji: IEmoji) => onSelectEmoji(emoji.native)} />
        </Suspense>
      )}
    </>
  );
});
