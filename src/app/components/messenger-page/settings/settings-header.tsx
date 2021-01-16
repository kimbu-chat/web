import React from 'react';

import ReturnSvg from 'icons/ic-arrow-left.svg';
import { Link } from 'react-router-dom';

interface ISettingsHeaderProps {
  title: string;
}

export const SettingsHeader: React.FC<ISettingsHeaderProps> = React.memo(({ title }) => (
  <div className='settings__header'>
    <Link to='/settings' className='settings__back'>
      <ReturnSvg viewBox='0 0 25 25' />
    </Link>
    <div className='settings__title'>{title}</div>
  </div>
));
