import React from 'react';
import RadioBox from '../shared/radio-box/radio-box';
import './language-settings.scss';

const LanguageSettings = () => {
	return (
		<div className='language-settings'>
			<form>
				<RadioBox groupName='language' nestingLevel={0} onClick={() => {}} title={'🇺🇸 English'} />
				<RadioBox groupName='language' nestingLevel={0} onClick={() => {}} title={'🇷🇺 Russian'} />
			</form>
		</div>
	);
};

export default LanguageSettings;
