import React, { Suspense, lazy } from 'react';
import { Switch } from 'react-router';

import './base.scss';

import { useSelector } from 'react-redux';
import { RootState } from 'app/store/root-reducer';

import i18nConfiguration from 'app/localization/i18n';
import { useTranslation } from 'react-i18next';

import PublicRoute from './routing/PublicRoute';
import PrivateRoute from './routing/PrivateRoute';

import { i18n, TFunction } from 'i18next';

const ConfirmPhone = lazy(() => import('./components/login-page/phone-confirmation/phone-confirmation'));
const ConfirmCode = lazy(() => import('./components/login-page/code-confirmation/code-confirmation'));
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
	const isAuthenticated = useSelector<RootState, boolean>((rootState) => rootState.auth.isAuthenticated);
	const phoneNumber = useSelector((state: RootState) => state.auth.phoneNumber);

	return (
		<LocalizationContext.Provider value={{ t, i18n }}>
			<Switch>
				<PrivateRoute
					path='/'
					isAllowed={isAuthenticated}
					fallback={'/login'}
					Component={
						<Suspense fallback={<div>Загрузка...</div>}>
							<Messenger />
						</Suspense>
					}
				/>
				<PublicRoute
					path='/confirm-code'
					isAllowed={phoneNumber.length > 0}
					Component={
						<Suspense fallback={<div>Загрузка...</div>}>
							<ConfirmCode />
						</Suspense>
					}
				/>
				<PublicRoute
					path='/login'
					Component={
						<Suspense fallback={<div>Загрузка...</div>}>
							<ConfirmPhone />
						</Suspense>
					}
				/>
			</Switch>
		</LocalizationContext.Provider>
	);
};
