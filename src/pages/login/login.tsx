import React from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { authPhoneNumberSelector } from '@store/login/selectors';
import { StoreKeys } from '@store/index';
import { PrivateRoute } from '@components/private-route';

import { ReactComponent as CurvedShape } from './curvedShape.svg';
import { ReactComponent as Vector3 } from './vector3.svg';
import { ReactComponent as Vector2 } from './vector2.svg';
import { ReactComponent as Vector1 } from './vector1.svg';
import { ReactComponent as KimbuText } from './kimbu.svg';
import { ReactComponent as Frame } from './Frame.svg';
import PhoneConfirmationPage from './phone-confirmation';

import './login.scss';

const BLOCK_NAME = 'login';

const CodeConfirmationPage = React.lazy(() => import('./code-confirmation'));

type LoginPageProps = {
  store: any;
};

const LoginPage: React.FC<LoginPageProps> = ({ store }) => {
  const { t } = useTranslation();

  const SignUpPage = React.lazy(async () => {
    const myProfile = await import('@store/my-profile/module');
    store.inject([[StoreKeys.MY_PROFILE, myProfile.reducer, myProfile.myProfileSagas]]);
    return import('./sign-up');
  });

  const phoneNumber = useSelector(authPhoneNumberSelector);

  return (
    <div className={BLOCK_NAME}>
      <CurvedShape className={`${BLOCK_NAME}__curved-shape`} />
      <Frame className={`${BLOCK_NAME}__frame`} />
      <Vector1 className={`${BLOCK_NAME}__vector1`} />
      <Vector2 className={`${BLOCK_NAME}__vector2`} />
      <Vector3 className={`${BLOCK_NAME}__vector3`} />
      <Link to="/login">
        <KimbuText className={`${BLOCK_NAME}__text-logo`} />
      </Link>
      <div className={`${BLOCK_NAME}__slogan-block`}>
        <p className={`${BLOCK_NAME}__slogan`}>{t('loginPage.connect')}</p>
        <p className={`${BLOCK_NAME}__slogan`}>{t('loginPage.chat_involve')}</p>
        <Switch>
          <Route exact path="/login">
            <PhoneConfirmationPage />
          </Route>
          <PrivateRoute
            path="/code-confirmation"
            componentToRender={<CodeConfirmationPage />}
            fallback="/login"
            isAllowed={!!phoneNumber}
          />
          <PrivateRoute
            path="/sign-up"
            componentToRender={<SignUpPage />}
            fallback="/login"
            isAllowed={!!phoneNumber}
          />
          <Route render={() => <Redirect to="/login" />} />
        </Switch>
      </div>
    </div>
  );
};

LoginPage.displayName = 'LoginPage';

export default LoginPage;
