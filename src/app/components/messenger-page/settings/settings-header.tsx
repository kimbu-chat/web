import React from 'react';

import ReturnSvg from 'icons/ic-arrow-left.svg';
import { Link, useLocation } from 'react-router-dom';

namespace SettingsHeaderNS {
  export interface Props {
    title: string;
  }
}

export const SettingsHeader = React.memo(({ title }: SettingsHeaderNS.Props) => {
  const location = useLocation();

  return (
    <div className='settings__header'>
      <Link
        to={location.pathname.replace(
          /\/?(contacts|calls|settings|chats)\/?([0-9]*)?\/?(edit-profile|notifications|language|typing)?\/?(info\/?(photo|video|files|audio-recordings|audios)?\/?)?/,
          (_all, _groupOne, _groupTwo, _groupThree, groupFour) => `/settings/${groupFour || ''}`,
        )}
        className='settings__back'
      >
        <ReturnSvg viewBox='0 0 25 25' />
      </Link>
      <div className='settings__title'>{title}</div>
    </div>
  );
});
