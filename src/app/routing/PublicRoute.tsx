import React from 'react';
import { Route, Redirect } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store/root-reducer';

namespace PublicRoute {
	export interface Props {
		Component: any;
		path: string;
		isAllowed?: boolean;
	}
}

function PublicRoute({ Component, path, isAllowed = true, ...rest }: PublicRoute.Props) {
	const isAuthenticated = useSelector<RootState, boolean>((rootState) => rootState.auth.isAuthenticated);
	return (
		<Route
			path={path}
			{...rest}
			render={({ location }) =>
				!isAuthenticated && isAllowed ? (
					Component
				) : (
					<Redirect
						to={{
							pathname: '/chats',
							state: { from: location },
						}}
					/>
				)
			}
		/>
	);
}

export default PublicRoute;
