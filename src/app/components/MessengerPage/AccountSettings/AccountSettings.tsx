import React, { useContext } from 'react';
import './AccountSettings.scss';
import LangCategory from './LangCategory/LangCategory';
import { LocalizationContext } from 'app/app';

namespace AccountSettings {
	export interface Props {
		isDisplayed: boolean;
		hide: () => void;
	}
}

const AccountSettings = ({ isDisplayed, hide }: AccountSettings.Props) => {
	const { t } = useContext(LocalizationContext);

	return (
		<div className={isDisplayed ? 'account-settings account-settings--active' : 'account-settings'}>
			<div className='account-settings__header'>
				<button onClick={hide} className='account-settings__back flat'>
					<div className='svg'>
						<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
							<path d='M10.634 3.634a.9.9 0 1 0-1.278-1.268l-4.995 5.03a.9.9 0 0 0 0 1.268l4.936 4.97a.9.9 0 0 0 1.278-1.268L6.268 8.03l4.366-4.396z'></path>
						</svg>
					</div>
					<span>{t('back')}</span>
				</button>
				<div className='account-settings__title'>{t('accountSettings.settings')}</div>
				<div className=''></div>
			</div>
			<main className='account-settings__main'>
				<LangCategory />
			</main>
		</div>
	);
};

export default React.memo(AccountSettings, (prevProps, nextProps) => prevProps.isDisplayed === nextProps.isDisplayed);
