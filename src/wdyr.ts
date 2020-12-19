import { useActionWithDeferred } from 'app/hooks/use-action-with-deferred';
import { useActionWithDispatch } from 'app/hooks/use-action-with-dispatch';
import { useGlobalDrop } from 'app/hooks/use-global-drop';
import { useOnClickOutside } from 'app/hooks/use-on-click-outside';
import { useReferState } from 'app/hooks/use-referred-state';
import { useHistory, useLocation } from 'react-router';
import { useHistory as useHistoryDom } from 'react-router-dom';
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackExtraHooks: [
      [useSelector, 'useSelector'],
      [useDispatch, 'useDispatch'],
      [useHistory, 'useHistory'],
      [useHistoryDom, 'useHistory'],
      [useLocation, 'useLocation'],
      [useTranslation, 'useTranslation'],
      [useActionWithDeferred, 'useActionWithDeferred'],
      [useActionWithDispatch, 'useActionWithDispatch'],
      [useGlobalDrop, 'useActionWithDeferred'],
      [useOnClickOutside, 'useOnClickOutside'],
      [useReferState, 'useReferState'],
    ],
  });
}
