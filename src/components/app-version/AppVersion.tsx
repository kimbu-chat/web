import React from 'react';

import classnames from 'classnames';
import { useTranslation } from 'react-i18next';

import './app-version.scss';

const BLOCK_NAME = 'app-version';

interface IAppVersionProps {
  className?: string;
}

export const AppVersion: React.FC<IAppVersionProps> = ({ className }) => {
  const { t } = useTranslation();
  return (
    <span className={classnames(BLOCK_NAME, className)}>
      {t('settings.app-version', { appName: 'KIMBU', version: process.env.REACT_APP_VERSION })}
    </span>
  );
};
