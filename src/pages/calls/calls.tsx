import React from 'react';

import { AddCall, CallList } from '@components';

import './calls.scss';

const BLOCK_NAME = 'calls-page';

export const CallsPage: React.FC = () => (
  <>
    <CallList />
    <div className={BLOCK_NAME}>
      <AddCall />
    </div>
  </>
);
