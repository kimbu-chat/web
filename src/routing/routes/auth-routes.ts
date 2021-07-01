import partialRight from 'lodash/partialRight';

import { StoreKeys, store } from '@store/index';
import { LazyPreload, preloadRouteComponent } from '@routing/preloading.utils';

import {
  ANONYMOUS_USER,
  LOGIN_PAGE_PATH,
  SIGN_UP_PATH,
  CODE_CONFIRMATION_PATH,
  PROSPECT_USER,
} from '../routing.constants';
import { RoutesEnum } from '../routing.types';
import withPageGuard from '../with-page-guard';

import type { RoutesObject } from '../routing.types';

const Login = LazyPreload(async () => {
  const loginModule = await import('@store/login/module');

  store.inject([[StoreKeys.LOGIN, loginModule.reducer, loginModule.loginSaga]]);
  return import('@pages/phone-confirmation');
});

const SignUpPage = LazyPreload(async () => {
  const myProfile = await import('@store/my-profile/module');
  store.inject([[StoreKeys.MY_PROFILE, myProfile.reducer, myProfile.myProfileSagas]]);
  return import('@pages/sign-up');
});

const CodeConfirmationPage = LazyPreload(() => import('@pages/code-confirmation'));

const Routes: RoutesObject = {
  [RoutesEnum.LOGIN]: {
    path: LOGIN_PAGE_PATH,
    pageName: 'Login',
    props: {
      component: withPageGuard([PROSPECT_USER, ANONYMOUS_USER])(Login),
    },
  },
  [RoutesEnum.CODE_CONFIRMATION]: {
    path: CODE_CONFIRMATION_PATH,
    pageName: 'Code confirmation',
    props: {
      component: withPageGuard([PROSPECT_USER])(CodeConfirmationPage),
    },
  },
  [RoutesEnum.SIGN_UP]: {
    path: SIGN_UP_PATH,
    pageName: 'Sign Up',
    props: {
      component: withPageGuard([PROSPECT_USER])(SignUpPage),
    },
  },
};

export const routes = Object.values(Routes);

export const preloadAuthRoute = partialRight(preloadRouteComponent, routes);
