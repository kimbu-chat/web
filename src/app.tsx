import React, { Suspense } from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CubeLoader } from '@components/cube-loader';
import { ReactComponent as CloseSvg } from '@icons/close.svg';
import '@localization/i18n';
import { DeviceType, getDeviceType } from '@utils/device-type';

import './dayjs/day';
import Layout, { Mobile } from './layout';

import './base.scss';
import './toastify.scss';

const App = () => {
  const device = getDeviceType();
  if (device !== DeviceType.DESKTOP) {
    return <Mobile />;
  }

  return (
    <>
      <Suspense fallback={<CubeLoader />}>
        <Layout />
      </Suspense>
      <ToastContainer
        autoClose={5000000}
        position="top-center"
        hideProgressBar
        closeButton={() => (
          <button type="button">
            <CloseSvg />
          </button>
        )}
      />
    </>
  );
};

App.displayName = 'App';

export { App };
