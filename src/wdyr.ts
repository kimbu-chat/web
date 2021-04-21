import { useActionWithDeferred } from '@hooks/use-action-with-deferred';
import { useActionWithDispatch } from '@hooks/use-action-with-dispatch';
import { useGlobalDrop } from '@hooks/use-global-drop';
import { useOnClickOutside } from '@hooks/use-on-click-outside';
import { useReferState } from '@hooks/use-referred-state';
import { useHistory, useLocation } from 'react-router';
import { useHistory as useHistoryDom } from 'react-router-dom';
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

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
      [useHistoryDom, 'useHistory'],
      [useLocation, 'useLocation'],
      [useTranslation, 'useTranslation'],
      [useActionWithDeferred, 'useActionWithDeferred'],
      [useActionWithDispatch, 'useActionWithDispatch'],
      [useGlobalDrop, 'useGlobalDrop'],
      [useOnClickOutside, 'useOnClickOutside'],
      [useReferState, 'useReferState'],
    ],
    include: [/[\s\S]+/g],
  });
}
