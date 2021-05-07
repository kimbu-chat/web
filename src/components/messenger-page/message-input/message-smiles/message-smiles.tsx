import React, { useCallback, useRef, useState, lazy, Suspense } from 'react';
import { ReactComponent as SmilesSvg } from '@icons/smiles.svg';
import 'emoji-mart/css/emoji-mart.css';

import { useOnClickOutside } from '@hooks/use-on-click-outside';
import './message-smiles.scss';
import { CubeLoader } from '@containers/cube-loader/cube-loader';
import { loadEmoji } from '@routing/module-loader';

const DeferredMessageSmiles = lazy(loadEmoji);

interface IMessageSmilesProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
}

export const MessageSmiles: React.FC<IMessageSmilesProps> = React.memo(({ setText }) => {
  const [smilesRendered, setSmilesRendered] = useState(false);

  const changeSmilesDisplayedStatus = useCallback(() => {
    setSmilesRendered((oldState) => !oldState);
  }, [setSmilesRendered]);
  const closeSmilesDisplayedStatus = useCallback(() => {
    setSmilesRendered(() => false);
  }, [setSmilesRendered]);

  const openEmojiRef = useRef<HTMLButtonElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(openEmojiRef, closeSmilesDisplayedStatus, emojiRef);

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
        <Suspense fallback={<CubeLoader />}>
          <DeferredMessageSmiles emojiRef={emojiRef} setText={setText} />
        </Suspense>
      )}
    </>
  );
});
