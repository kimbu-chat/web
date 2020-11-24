import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import './base.scss';

import { useSelector } from 'react-redux';
import { RootState } from 'store/root-reducer';

import i18nConfiguration from 'app/localization/i18n';
import { useTranslation } from 'react-i18next';

import PublicRoute from './routing/PublicRoute';
import PrivateRoute from './routing/PrivateRoute';

import { i18n, TFunction } from 'i18next';
import CubeLoader from './containers/cube-loader/cube-loader';
import { loadPhoneConfirmation, loadCodeConfirmation, loadMessenger, loadNotFound } from './routing/module-loader';

const ConfirmPhone = lazy(loadPhoneConfirmation);
const ConfirmCode = lazy(loadCodeConfirmation);
const Messenger = lazy(loadMessenger);
const NotFound = lazy(loadNotFound);

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
				<PublicRoute
					exact
					path='/confirm-code'
					isAllowed={phoneNumber.length > 0}
					Component={
						<Suspense fallback={<CubeLoader />}>
							<ConfirmCode preloadNext={loadMessenger} />
						</Suspense>
					}
				/>
				<PublicRoute
					exact
					path='/login/'
					Component={
						<Suspense fallback={<CubeLoader />}>
							<ConfirmPhone preloadNext={loadCodeConfirmation} />
						</Suspense>
					}
				/>
				<PrivateRoute
					path='/(contacts|calls|settings|chats)/:chatId?/(edit-profile|notifications|language|typing)?/(info)?/(photo|audio-recordings|audios|video|files)?'
					exact
					isAllowed={isAuthenticated}
					fallback={'/login'}
					Component={
						<Suspense fallback={<CubeLoader />}>
							<Messenger />
						</Suspense>
					}
				/>
				<Route path='/' exact render={() => <Redirect to='/chats' />} />
				<Route
					path='/'
					isAllowed={true}
					render={() => (
						<Suspense fallback={<CubeLoader />}>
							<NotFound />
						</Suspense>
					)}
				/>
			</Switch>
		</LocalizationContext.Provider>
	);
};
