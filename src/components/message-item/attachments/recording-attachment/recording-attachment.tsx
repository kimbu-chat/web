import React from 'react';

import { Recording } from '@components/recording';

import './recording-attachment.scss';

const BLOCK_NAME = 'recording-attachment';

export const RecordingAttachment: React.FC<React.ComponentProps<typeof Recording>> = (props) => (
  <div className={BLOCK_NAME}>
    <Recording {...props} />
  </div>
);
