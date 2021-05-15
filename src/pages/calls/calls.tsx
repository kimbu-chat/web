import React from 'react';

import { AddCall } from '@components/call-list/add-call';
import { CallList } from '@components/call-list';

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
