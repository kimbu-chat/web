import React from 'react';
import { Switch } from 'react-router';
import LoginPage from './containers/login-page/login-page';
import Messenger from './containers/messenger/messenger';
import './base.scss';
import i18nConfiguration from 'app/localization/i18n';
import { useTranslation } from 'react-i18next';
import PublicRoute from './routing/PublicRoute';
import PrivateRoute from './routing/PrivateRoute';
import { i18n, TFunction } from 'i18next';

namespace App {
	export interface localization {
		t: TFunction;
		i18n?: i18n;
	}
}

export const LocalizationContext = React.createContext<App.localization>({ t: (str: string) => str });

export const App = () => {
	const { t, i18n } = useTranslation(undefined, { i18n: i18nConfiguration });

	return (
		<LocalizationContext.Provider value={{ t, i18n }}>
			<Switch>
				<PrivateRoute path='/chats/:id?' Component={Messenger} />
				<PublicRoute path='/' Component={LoginPage} />
			</Switch>
		</LocalizationContext.Provider>
	);
};
