import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';

namespace PrivateRoute {
	export interface Props extends RouteProps {
		Component: JSX.Element;
		path: string;
		isAllowed: boolean;
		fallback?: string;
	}
}

export const PrivateRoute = React.memo(({ Component, path, fallback, isAllowed, ...rest }: PrivateRoute.Props) => {
	return (
		<Route
			path={path}
			{...rest}
			render={({ location }) =>
				isAllowed ? (
					Component
				) : (
					<Redirect
						to={{
							pathname: fallback,
							state: { from: location },
						}}
					/>
				)
			}
		/>
	);
});
