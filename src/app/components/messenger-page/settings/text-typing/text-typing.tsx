import { LocalizationContext } from 'app/app';
import { SettingsActions } from 'app/store/settings/actions';
import { typingStrategy } from 'app/store/settings/models';
import { getTypingStrategy } from 'app/store/settings/selectors';
import { useActionWithDispatch } from 'app/utils/use-action-with-dispatch';
import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import RadioBox from '../shared/radio-box/radio-box';
import './text-typing.scss';

const TextTyping = () => {
	//@ts-ignore
	const { t } = useContext(LocalizationContext);

	const currentStrategy = useSelector(getTypingStrategy);

	const changeTypingStrategy = useActionWithDispatch(SettingsActions.changeTypingStrategyAction);
	const setNle = useCallback(() => {
		changeTypingStrategy({ strategy: typingStrategy.nle });
	}, []);

	const setNlce = useCallback(() => {
		changeTypingStrategy({ strategy: typingStrategy.nlce });
	}, []);

	return (
		<div className='text-typing'>
			<form>
				<RadioBox
					groupName='text-typing'
					nestingLevel={0}
					onClick={setNlce}
					defaultChecked={currentStrategy === typingStrategy.nlce}
					title={'Send a message by Enter, insert a new line by Shift/Ctrl/Alt + Enter'}
				/>
				<RadioBox
					groupName='text-typing'
					nestingLevel={0}
					onClick={setNle}
					defaultChecked={currentStrategy === typingStrategy.nle}
					title={'Send a message by Shift/Ctrl/Alt + Enter, insert a new line by Enter'}
				/>
			</form>
		</div>
	);
};

export default TextTyping;
