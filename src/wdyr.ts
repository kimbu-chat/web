import { useHistory, useLocation } from 'react-router-dom';
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { useReferState } from '@hooks/use-referred-state';
import { useOnClickOutside } from '@hooks/use-on-click-outside';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useActionWithDeferred } from '@hooks/use-action-with-deferred';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
    trackExtraHooks: [
      [useSelector, 'useSelector'],
      [useDispatch, 'useDispatch'],
      [useHistory, 'useHistory'],
      [useLocation, 'useLocation'],
      [useTranslation, 'useTranslation'],
      [useActionWithDeferred, 'useActionWithDeferred'],
      [useActionWithDispatch, 'useActionWithDispatch'],
      [useOnClickOutside, 'useOnClickOutside'],
      [useReferState, 'useReferState'],
    ],
    include: [/[\s\S]+/g],
  });
}
