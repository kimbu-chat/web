import React, { Suspense, lazy } from 'react';
import { Switch } from 'react-router';
import './base.scss';
import i18nConfiguration from 'app/localization/i18n';
import { useTranslation } from 'react-i18next';
import PublicRoute from './routing/PublicRoute';
import PrivateRoute from './routing/PrivateRoute';
import { i18n, TFunction } from 'i18next';

const LoginPage = lazy(() => import('./containers/login-page/login-page'));
const Messenger = lazy(() => import('./containers/messenger/messenger'));

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
				<PrivateRoute
					path='/chats/:id?'
					Component={
						<Suspense fallback={<div>Загрузка...</div>}>
							<Messenger />
						</Suspense>
					}
				/>
				<PublicRoute
					path='/'
					Component={
						<Suspense fallback={<div>Загрузка...</div>}>
							<LoginPage />
						</Suspense>
					}
				/>
			</Switch>
		</LocalizationContext.Provider>
	);
};
