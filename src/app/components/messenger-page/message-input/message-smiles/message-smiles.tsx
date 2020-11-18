import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Picker, BaseEmoji } from 'emoji-mart';
import SmilesSvg from 'app/assets/icons/ic-smile.svg';
import 'emoji-mart/css/emoji-mart.css';
import { LocalizationContext } from 'app/app';
import useOnClickOutside from 'app/utils/hooks/use-on-click-outside';
import './message-smiles.scss';

namespace MessageSmiles {
	export interface Props {
		setText: React.Dispatch<React.SetStateAction<string>>;
	}
}

const MessageSmiles = ({ setText }: MessageSmiles.Props) => {
	const { t } = useContext(LocalizationContext);

	const [smilesDisplayed, setSmilesDisplayed] = useState(false);
	const [smilesRendered, setSmilesRendered] = useState(false);

	const changeSmilesDisplayedStatus = useCallback(() => {
		setSmilesDisplayed((oldState) => !oldState);
	}, [setSmilesDisplayed]);
	const closeSmilesDisplayedStatus = useCallback(() => {
		setSmilesDisplayed(() => false);
	}, [setSmilesDisplayed]);

	const emojiRef = useRef<HTMLDivElement>(null);
	const openEmojiRef = useRef<HTMLButtonElement>(null);

	useOnClickOutside(emojiRef, closeSmilesDisplayedStatus, openEmojiRef);

	useEffect(() => {
		setTimeout(() => {
			setSmilesRendered(true);
		}, 200);
	}, []);

	const addNewSmile = useCallback(
		(emoji: BaseEmoji) => {
			setText((oldText) => oldText + (emoji.native as string));
		},
		[setText],
	);

	return (
		<>
			<button ref={openEmojiRef} onClick={changeSmilesDisplayedStatus} className='message-input__smiles-btn'>
				<SmilesSvg />
			</button>
			{smilesRendered && (
				<div ref={emojiRef} className={`emoji-wrapper ${smilesDisplayed ? '' : 'emoji-wrapper--hidden'}`}>
					<Picker
						set='apple'
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
};

export default MessageSmiles;
